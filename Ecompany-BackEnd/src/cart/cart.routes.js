'use strict'

const express = require('express')
const api = express.Router()
const cartController = require('./cart.controller');
const {ensureAuth, isUser, isAdmin} = require('../services/authenticated')

api.get('/test', cartController.test)
// Rutas para Usuario
api.post('/addToCart', [ensureAuth, isUser],cartController.addProductCart)
api.delete('/deleteCart/:id', [ensureAuth, isUser], cartController.deleteCart)
api.put('/deleteProductInCart/:id', [ensureAuth, isUser], cartController.deleteProductInCart)
api.put('/updateProductInCart/:id', [ensureAuth, isUser], cartController.updateCart)

// Rutas para administrador
api.get('/getCarts', [ensureAuth, isAdmin], cartController.getCarts)

// Rutas para ambos
api.get('/getCartByUser/:id', ensureAuth, cartController.getCartByUser)

module.exports = api;