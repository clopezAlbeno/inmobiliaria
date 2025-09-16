'use strict'

const userController = require('./user.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../services/authenticated')
const conenctMultiparty = require('connect-multiparty');
const file = conenctMultiparty()

api.get('/test', userController.test);
api.post('/login', userController.login);

// Rutas de usuario
api.post('/register', userController.register);

// Rutas de administrador
api.post('/createAccount', [ensureAuth, isAdmin], userController.createAccount);
api.get('/gets', [ensureAuth, isAdmin], userController.getAccounts);
api.post('/searchByFilter', [ensureAuth, isAdmin], userController.searchAccountByFilter)

// Rutas para ambos
api.get('/getInfo', ensureAuth, userController.getInfo)
api.get('/searchById/:id', ensureAuth, userController.searchAccountById);
api.get('/getPhoto/:id', userController.getPhoto)
api.put('/updateAccount/:id', ensureAuth, userController.editAccount);
api.put('/updatePhoto/:id', [ensureAuth, file], userController.updatePhoto);
api.put('/deletePhoto/:id', ensureAuth, userController.deletePhoto);
api.put('/updatePassword/:id', ensureAuth, userController.updatePassword)
api.delete('/deleteAccount/:id', ensureAuth, userController.deleteAccount);

module.exports = api;