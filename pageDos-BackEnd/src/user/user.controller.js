const UsuarioModel = require('./user.model');

class UsuarioController {
    static async create(req, res) {
        try {
            const { ip_usuario, pagina_visitada, navegador, sistema_operativo, ubicacion } = req.body;
            await UsuarioModel.create(ip_usuario, pagina_visitada, navegador, sistema_operativo, ubicacion);
            res.status(201).json({ message: 'Usuario registrado correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al registrar usuario' });
        }
    }

    static async getAll(req, res) {
        try {
            const usuarios = await UsuarioModel.getAll();
            res.json(usuarios);
        } catch (error) {
            console.error('Error en create:', error);
            res.status(500).json({ error: 'Error al enviar formulario', detalles: error.message });
        }
    }
}

module.exports = UsuarioController;
