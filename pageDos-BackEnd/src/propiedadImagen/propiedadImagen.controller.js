const PropiedadImagenModel = require('./propiedadImagen.model');
const { uploadFileToDrive } = require('../../config/googleDrive');
const path = require('path');

const FOLDER_ID = "1WJJl2Gcbpr2zUi9mke0Y2XraX--3jGQ1"; //folder id de Google Drive

class PropiedadImagenController {
    static async upload(req, res) {
        try {
            const { id_propiedad } = req.body;

            if (!req.file) {
                return res.status(400).json({ error: 'No se envió ninguna imagen' });
            }

            // Subir a Google Drive
            const result = await uploadFileToDrive(req.file.path, req.file.originalname, FOLDER_ID);

            // Guardar URL en DB
            await PropiedadImagenModel.create(id_propiedad, result.link);

            res.status(201).json({
                message: 'Imagen subida correctamente a Google Drive',
                url: result.link
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al subir imagen a Drive' });
        }
    }

    static async getByPropiedad(req, res) {
        try {
            const { id } = req.params;
            const imagenes = await PropiedadImagenModel.getByPropiedad(id);
            res.json(imagenes);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener imágenes' });
        }
    }
}

module.exports = PropiedadImagenController;
