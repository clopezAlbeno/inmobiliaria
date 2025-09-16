'use strict'

const mongoose = require('mongoose')

const mapSchema = mongoose.Schema({
    lat: {
        type: String,
        required: true
    },
    lng: {
        type: String,
        required: true
    },
    name: {
        type: String
    }
},{
    versionKey: false
})

module.exports = mongoose.model('Map', mapSchema)