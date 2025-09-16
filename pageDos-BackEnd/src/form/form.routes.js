const express = require('express');
const router = express.Router();
const FormularioController = require('./form.controller');

router.post('/', FormularioController.create);
router.get('/', FormularioController.getAll);

module.exports = router;
