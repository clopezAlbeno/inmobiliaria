'use strict'

const express = require('express');
const api = express.Router();
const mapController = require('../map/map.controller')

api.get('/get', mapController.getPins);
api.post('/add', mapController.addPin);
api.delete('/delete/:id', mapController.deletePin);

module.exports = api
