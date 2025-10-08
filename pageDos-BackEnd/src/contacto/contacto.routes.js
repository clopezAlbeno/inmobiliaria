const express = require('express');
const router = express.Router();
const ContactoController = require('./contacto.controller');
const { verifyToken, verifyAdmin } = require('../services/authenticated');

// Rutas públicas para envío de formularios
router.post('/general', ContactoController.createFormularioContacto);
router.post('/propiedad/:id_propiedad', ContactoController.createContactoPropiedad);

// Rutas protegidas para administración de formularios
router.get('/general', verifyToken, verifyAdmin, ContactoController.getAllFormulariosContacto);
router.get('/propiedad/:id_propiedad', verifyToken, ContactoController.getAllContactosPropiedad);
router.delete('/general/:id', verifyToken, verifyAdmin, ContactoController.deleteFormularioContacto);
router.delete('/propiedad/:id_propiedad/:id', verifyToken, ContactoController.deleteContactoPropiedad);

module.exports = router;