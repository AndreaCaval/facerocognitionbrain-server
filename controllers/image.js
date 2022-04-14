const fetch = require("node-fetch")
const dotenv = require('dotenv');
dotenv.config();

const clarifai_key = process.env.CLARIFAI_KEY

let raw = {
    "user_app_id": {
        "user_id": "cava",
        "app_id": "brain"
    },
    "inputs": [{
        "data": {
            "image": {
                "url": ''
            }
        }
    }]
};
let requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + clarifai_key
    },
    body: ''
};

const handleApiCall = (req, res) => {
    raw.inputs[0].data.image.url = req.body.input
    requestOptions.body = JSON.stringify(raw)
    fetch("https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs", requestOptions)
        .then(response => response.json())
        .then(data => { res.json(data) })
        .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
    const { id } = req.body
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}