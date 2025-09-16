'use strict'

const express = require('express');
const api = express.Router(); 
const categoryController = require('./category.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');
const connectMultiparty = require('connect-multiparty')
const file = connectMultiparty()


//ruta test
api.get('/test', categoryController.test);

// Rutas de administrador
api.post('/add', [ensureAuth, isAdmin, file],categoryController .addCategory);
api.put('/update/:id', categoryController.updateCategory);
api.delete('/delete/:id', categoryController.deleteCategory);
// Rutas publicas
api.get('/get', categoryController.getCategories);
api.get('/getCategory/:id', categoryController.getCategory);
api.post('/searchCategories', categoryController.searchCategory);

//foto
api.get('/getImage/:id', file, categoryController.getImage)
api.put('/updateImage/:id', [file, ensureAuth, isAdmin], categoryController.updateImage)

module.exports = api;
