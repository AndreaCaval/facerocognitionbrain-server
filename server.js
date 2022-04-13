/*
/ --> res = this is working
/singin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require("bcrypt-nodejs");
const cors = require('cors')

const app = express()

const database = {
    users: [
        { id: '123', name: 'John', email: 'john@gmail.com', password: 'wick', entries: 0, joined: new Date() },
        { id: '53', name: 'sally', email: 'sally@gmail.com', password: 'banana', entries: 0, joined: new Date() }
    ],
    login: [
        { id: '432', hash: '$2a$10$jEcVfFyn04wSPKw/aerN/.0oM82lT8K/pur71Ey9C/2fwxn/ejeTe', email: 'john@gmail.com' }
    ]
}

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send(database)
})

app.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (email === database.users[0].email) {
        bcrypt.compare(password, database.login[0].hash, function(err, response) {

            if (response)
                res.json(database.users[0]);

            else
                res.json('error wrong pw')
        });
    } else {
        res.status(400).json('error loggin in')
    }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
    });
    if (email === database.users[0].email && password === database.users[0].password)
        res.status(400).json('error email already register')
    else {
        database.users.push({ id: '12', name: name, email: email, entries: 0, joined: new Date() })
        res.json(database.users[database.users.length - 1])
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body
    let found = false
    database.users.forEach(user => {
        if (user.id === id) {
            found = true
            user.entries++
                return res.json(user.entries)
        }
    })
    if (!found)
        res.status(400).json('not found')
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params
    let found = false
    database.users.forEach(user => {
        if (user.id === id) {
            found = true
            return res.json(user)
        }
    })
    if (!found)
        res.status(400).json('not found')

})



app.listen(3000, () => {
    console.log('app is running');
})