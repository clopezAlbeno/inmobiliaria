const express = require('express');
const router = express.Router();
const PropiedadController = require('./propiedad.controller');

router.post('/', PropiedadController.create);
router.get('/', PropiedadController.getAll);
router.get('/:id', PropiedadController.getById);
router.put('/:id', PropiedadController.update);
router.delete('/:id', PropiedadController.delete);

module.exports = router;
