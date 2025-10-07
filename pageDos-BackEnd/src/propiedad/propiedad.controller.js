const PropiedadModel = require('./propiedad.model');

class PropiedadController {
    static async create(req, res) {
        try {
            await PropiedadModel.create(req.body);
            res.status(201).json({ message: 'Propiedad creada correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear propiedad' });
        }
    }

    static async getAll(req, res) {
        try {
            const propiedades = await PropiedadModel.getAll();
            res.json(propiedades);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener propiedades' });
        }
    }

    static async getById(req, res) {
        try {
            const propiedad = await PropiedadModel.getById(req.params.id);
            if (!propiedad) {
                return res.status(404).json({ error: 'Propiedad no encontrada' });
            }
            res.json(propiedad);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener propiedad' });
        }
    }

    static async update(req, res) {
        try {
            await PropiedadModel.update(req.params.id, req.body);
            res.json({ message: 'Propiedad actualizada correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar propiedad' });
        }
    }

    static async delete(req, res) {
        try {
            await PropiedadModel.delete(req.params.id);
            res.json({ message: 'Propiedad eliminada correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar propiedad' });
        }
    }
}

module.exports = PropiedadController;
