const PropiedadModel = require('./propiedad.model');
const PropiedadImagenModel = require('../propiedadImagen/propiedadImagen.model');
const { validateProperty } = require('../utils/propertyValidator');

class PropiedadController {
    static async create(req, res) {
        try {
            const { isValid, errors } = validateProperty(req.body);
            if (!isValid) {
                return res.status(400).json({ 
                    error: 'Datos de propiedad inválidos',
                    details: errors 
                });
            }

            // Asignar el usuario actual como propietario
            const data = {
                ...req.body,
                id_usuario: req.user.id
            };

            const result = await PropiedadModel.create(data);
            res.status(201).json({ 
                message: 'Propiedad creada correctamente',
                id: result.id
            });
        } catch (error) {
            console.error('Error en create:', error);
            res.status(500).json({ 
                error: 'Error al crear propiedad',
                details: error.message 
            });
        }
    }

    static async getAll(req, res) {
        try {
            const filters = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                tipo_operacion: req.query.tipo_operacion,
                ciudad: req.query.ciudad,
                precio_min: req.query.precio_min,
                precio_max: req.query.precio_max,
                habitaciones: req.query.habitaciones,
                banos: req.query.banos,
                estacionamientos: req.query.estacionamientos,
                id_tipo_propiedad: req.query.id_tipo_propiedad
            };

            const propiedades = await PropiedadModel.getAll(filters);
            res.json({
                page: filters.page,
                limit: filters.limit,
                total: propiedades.length,
                data: propiedades
            });
        } catch (error) {
            console.error('Error en getAll:', error);
            res.status(500).json({ 
                error: 'Error al obtener propiedades' 
            });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const propiedad = await PropiedadModel.getById(id);
            
            if (!propiedad) {
                return res.status(404).json({ 
                    error: 'Propiedad no encontrada' 
                });
            }

            res.json(propiedad);
        } catch (error) {
            console.error('Error en getById:', error);
            res.status(500).json({ 
                error: 'Error al obtener propiedad' 
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const propiedad = await PropiedadModel.getById(id);

            if (!propiedad) {
                return res.status(404).json({ 
                    error: 'Propiedad no encontrada' 
                });
            }

            // Verificar que el usuario sea el propietario o un admin
            if (propiedad.id_usuario !== req.user.id && req.user.rol !== 'admin') {
                return res.status(403).json({ 
                    error: 'No autorizado para modificar esta propiedad' 
                });
            }

            const { isValid, errors } = validateProperty(req.body);
            if (!isValid) {
                return res.status(400).json({ 
                    error: 'Datos de propiedad inválidos',
                    details: errors 
                });
            }

            await PropiedadModel.update(id, req.body);
            res.json({ 
                message: 'Propiedad actualizada correctamente' 
            });
        } catch (error) {
            console.error('Error en update:', error);
            res.status(500).json({ 
                error: 'Error al actualizar propiedad' 
            });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const propiedad = await PropiedadModel.getById(id);

            if (!propiedad) {
                return res.status(404).json({ 
                    error: 'Propiedad no encontrada' 
                });
            }

            // Verificar que el usuario sea el propietario o un admin
            if (propiedad.id_usuario !== req.user.id && req.user.rol !== 'admin') {
                return res.status(403).json({ 
                    error: 'No autorizado para eliminar esta propiedad' 
                });
            }

            await PropiedadModel.delete(id);
            res.json({ 
                message: 'Propiedad eliminada correctamente' 
            });
        } catch (error) {
            console.error('Error en delete:', error);
            res.status(500).json({ 
                error: 'Error al eliminar propiedad' 
            });
        }
    }

    // Manejo de imágenes
    static async addImage(req, res) {
        try {
            const { id } = req.params;
            const { url_imagen, es_principal } = req.body;

            const propiedad = await PropiedadModel.getById(id);
            if (!propiedad) {
                return res.status(404).json({ 
                    error: 'Propiedad no encontrada' 
                });
            }

            // Verificar que el usuario sea el propietario o un admin
            if (propiedad.id_usuario !== req.user.id && req.user.rol !== 'admin') {
                return res.status(403).json({ 
                    error: 'No autorizado para modificar esta propiedad' 
                });
            }

            await PropiedadImagenModel.create(id, url_imagen, es_principal);
            res.status(201).json({ 
                message: 'Imagen agregada correctamente' 
            });
        } catch (error) {
            console.error('Error en addImage:', error);
            res.status(500).json({ 
                error: 'Error al agregar imagen' 
            });
        }
    }

    static async removeImage(req, res) {
        try {
            const { id, imageId } = req.params;
            const propiedad = await PropiedadModel.getById(id);

            if (!propiedad) {
                return res.status(404).json({ 
                    error: 'Propiedad no encontrada' 
                });
            }

            // Verificar que el usuario sea el propietario o un admin
            if (propiedad.id_usuario !== req.user.id && req.user.rol !== 'admin') {
                return res.status(403).json({ 
                    error: 'No autorizado para modificar esta propiedad' 
                });
            }

            await PropiedadImagenModel.delete(imageId);
            res.json({ 
                message: 'Imagen eliminada correctamente' 
            });
        } catch (error) {
            console.error('Error en removeImage:', error);
            res.status(500).json({ 
                error: 'Error al eliminar imagen' 
            });
        }
    }

    static async setPrincipalImage(req, res) {
        try {
            const { id, imageId } = req.params;
            const propiedad = await PropiedadModel.getById(id);

            if (!propiedad) {
                return res.status(404).json({ 
                    error: 'Propiedad no encontrada' 
                });
            }

            // Verificar que el usuario sea el propietario o un admin
            if (propiedad.id_usuario !== req.user.id && req.user.rol !== 'admin') {
                return res.status(403).json({ 
                    error: 'No autorizado para modificar esta propiedad' 
                });
            }

            await PropiedadImagenModel.setPrincipal(imageId, id);
            res.json({ 
                message: 'Imagen principal actualizada correctamente' 
            });
        } catch (error) {
            console.error('Error en setPrincipalImage:', error);
            res.status(500).json({ 
                error: 'Error al actualizar imagen principal' 
            });
        }
    }
}

module.exports = PropiedadController;