const express = require('express');
const router = express.Router();
const PropiedadController = require('./propiedad.controller');
const { verifyToken } = require('../services/authenticated');

// Rutas públicas
router.get('/', PropiedadController.getAll);
router.get('/:id', PropiedadController.getById);

// Rutas protegidas (requieren autenticación)
router.post('/', verifyToken, PropiedadController.create);
router.put('/:id', verifyToken, PropiedadController.update);
router.delete('/:id', verifyToken, PropiedadController.delete);

// Rutas para manejo de imágenes
router.post('/:id/imagenes', verifyToken, PropiedadController.addImage);
router.delete('/:id/imagenes/:imageId', verifyToken, PropiedadController.removeImage);
router.put('/:id/imagenes/:imageId/principal', verifyToken, PropiedadController.setPrincipalImage);

module.exports = router;
