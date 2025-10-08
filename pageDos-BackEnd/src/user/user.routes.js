const express = require('express');
const router = express.Router();
const UsuarioController = require('./user.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');

// Rutas públicas
router.post('/register', UsuarioController.register);
router.post('/login', UsuarioController.login);

// Rutas protegidas para usuarios autenticados
router.get('/profile', ensureAuth, UsuarioController.getProfile);
router.put('/profile', ensureAuth, UsuarioController.updateProfile);
router.put('/password', ensureAuth, UsuarioController.updatePassword);

// Rutas protegidas para administradores
router.get('/', ensureAuth, isAdmin, UsuarioController.getAllUsers);
router.delete('/:id', ensureAuth, isAdmin, UsuarioController.deleteUser);

module.exports = router;
