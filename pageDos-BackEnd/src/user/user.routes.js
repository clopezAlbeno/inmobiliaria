const express = require('express');
const router = express.Router();
const UsuarioController = require('./user.controller');

router.post('/', UsuarioController.create);
router.get('/', UsuarioController.getAll);

module.exports = router;
