const ContactoModel = require('./contacto.model');
const PropiedadModel = require('../propiedad/propiedad.model');

class ContactoController {
    static async createFormularioContacto(req, res) {
        try {
            const { nombre, correo, telefono, mensaje } = req.body;

            if (!nombre || !correo || !mensaje) {
                return res.status(400).json({ 
                    error: 'Nombre, correo y mensaje son campos requeridos' 
                });
            }

            await ContactoModel.createFormularioContacto({
                nombre,
                correo,
                telefono,
                mensaje
            });

            res.status(201).json({
                message: 'Formulario de contacto enviado correctamente'
            });
        } catch (error) {
            console.error('Error en createFormularioContacto:', error);
            res.status(500).json({ 
                error: 'Error al enviar el formulario de contacto' 
            });
        }
    }

    static async createContactoPropiedad(req, res) {
        try {
            const { id_propiedad } = req.params;
            const { nombre, correo, telefono, mensaje } = req.body;

            if (!nombre || !correo || !mensaje) {
                return res.status(400).json({ 
                    error: 'Nombre, correo y mensaje son campos requeridos' 
                });
            }

            // Verificar que la propiedad existe
            const propiedad = await PropiedadModel.getById(id_propiedad);
            if (!propiedad) {
                return res.status(404).json({ 
                    error: 'Propiedad no encontrada' 
                });
            }

            await ContactoModel.createContactoPropiedad({
                id_propiedad,
                nombre,
                correo,
                telefono,
                mensaje
            });

            res.status(201).json({
                message: 'Mensaje de contacto enviado correctamente'
            });
        } catch (error) {
            console.error('Error en createContactoPropiedad:', error);
            res.status(500).json({ 
                error: 'Error al enviar el mensaje de contacto' 
            });
        }
    }

    static async getAllFormulariosContacto(req, res) {
        try {
            // Verificar si el usuario es admin
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ 
                    error: 'Acceso no autorizado' 
                });
            }

            const formularios = await ContactoModel.getAllFormulariosContacto();
            res.json(formularios);
        } catch (error) {
            console.error('Error en getAllFormulariosContacto:', error);
            res.status(500).json({ 
                error: 'Error al obtener formularios de contacto' 
            });
        }
    }

    static async getAllContactosPropiedad(req, res) {
        try {
            const { id_propiedad } = req.params;

            // Verificar que la propiedad existe
            const propiedad = await PropiedadModel.getById(id_propiedad);
            if (!propiedad) {
                return res.status(404).json({ 
                    error: 'Propiedad no encontrada' 
                });
            }

            // Verificar que el usuario es el propietario o admin
            if (propiedad.id_usuario !== req.user.id && req.user.rol !== 'admin') {
                return res.status(403).json({ 
                    error: 'No autorizado para ver estos mensajes' 
                });
            }

            const contactos = await ContactoModel.getAllContactosPropiedad(id_propiedad);
            res.json(contactos);
        } catch (error) {
            console.error('Error en getAllContactosPropiedad:', error);
            res.status(500).json({ 
                error: 'Error al obtener mensajes de contacto' 
            });
        }
    }

    static async deleteFormularioContacto(req, res) {
        try {
            // Verificar si el usuario es admin
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ 
                    error: 'Acceso no autorizado' 
                });
            }

            const { id } = req.params;
            await ContactoModel.deleteFormularioContacto(id);
            
            res.json({
                message: 'Formulario de contacto eliminado correctamente'
            });
        } catch (error) {
            console.error('Error en deleteFormularioContacto:', error);
            res.status(500).json({ 
                error: 'Error al eliminar formulario de contacto' 
            });
        }
    }

    static async deleteContactoPropiedad(req, res) {
        try {
            const { id_propiedad, id } = req.params;

            // Verificar que la propiedad existe
            const propiedad = await PropiedadModel.getById(id_propiedad);
            if (!propiedad) {
                return res.status(404).json({ 
                    error: 'Propiedad no encontrada' 
                });
            }

            // Verificar que el usuario es el propietario o admin
            if (propiedad.id_usuario !== req.user.id && req.user.rol !== 'admin') {
                return res.status(403).json({ 
                    error: 'No autorizado para eliminar este mensaje' 
                });
            }

            await ContactoModel.deleteContactoPropiedad(id);
            
            res.json({
                message: 'Mensaje de contacto eliminado correctamente'
            });
        } catch (error) {
            console.error('Error en deleteContactoPropiedad:', error);
            res.status(500).json({ 
                error: 'Error al eliminar mensaje de contacto' 
            });
        }
    }
}

module.exports = ContactoController;