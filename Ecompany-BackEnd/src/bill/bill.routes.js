'use strict'

const express = require('express')
const api = express.Router()
const billController = require('./bill.controller');
const {ensureAuth, isAdmin, isUser} = require('../services/authenticated')

api.get('/test', billController.test);

// Rutas para usuario
api.post('/buy', [ensureAuth, isUser], billController.createBill)

// Rutas para administrador
api.put('/deleteProductsInBill/:bill/:product', [ensureAuth, isAdmin], billController.deleteProductsInBill);
api.put('/updateProductInBill/:bill/:product', [ensureAuth, isAdmin], billController.updateBill);
api.put('/acceptedBill/:id', [ensureAuth, isAdmin], billController.acceptedBill);

// Rutas para ambos
api.get('/getBillById/:id', ensureAuth, billController.getBillById);
api.get('/getBills', ensureAuth, billController.getBills)
api.get('/getPending', ensureAuth, billController.getPending)
api.get('/getDelivered', ensureAuth, billController.getDelivered)
api.get('/searchBillByFilter', ensureAuth, billController.searchBillByFilter)
api.delete('/cancelBill/:id', ensureAuth, billController.deleteBill);

module.exports = api;