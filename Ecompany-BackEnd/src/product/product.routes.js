'use strict'

const express = require('express');
const api = express.Router();
const productController = require('../product/product.controller')
const { ensureAuth, isAdmin, isClient} = require('../services/authenticated')
const connectMultiparty = require('connect-multiparty')
const file = connectMultiparty()

// Rutas de administrador
api.post('/add',[ensureAuth, isAdmin, file], productController.addProduct)
api.put('/update/:id', [ensureAuth, isAdmin], productController.update)
api.delete('/delete/:id', [ensureAuth, isAdmin], productController.delete)
api.put('/updatePhoto/:id', [file, ensureAuth, isAdmin], productController.updatePhoto)
// Rutas publicas
api.get('/get', productController.get)
api.get('/getProduct/:id', productController.getProduct)
api.get('/getSales', productController.getSales)
api.get('/getUnavailables', productController.getUnavailables)
api.post('/getProductName', productController.getProductName)
api.get('/getProductCategory/:id', productController.getProductCategory)
api.get('/getPhoto/:id', file, productController.getPhoto)

module.exports = api
