const express = require('express');
const multer = require('multer');
const router = express.Router();
const PropiedadImagenController = require('./propiedadImagen.controller');

// Configuración de multer (temporal, solo para recibir archivo)
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('imagen'), PropiedadImagenController.upload);
router.get('/:id', PropiedadImagenController.getByPropiedad);

module.exports = router;
