const FormularioModel = require('./form.model');

class FormularioController {
    static async create(req, res) {
        try {
            const { nombre, telefono, correo, empresa, descripcion } = req.body;
            await FormularioModel.create(nombre, telefono, correo, empresa, descripcion);
            res.status(201).json({ message: 'Formulario enviado correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al enviar formulario' });
        }
    }

    static async getAll(req, res) {
        try {
            const formularios = await FormularioModel.getAll();
            res.json(formularios);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener formularios' });
        }
    }
}

module.exports = FormularioController;
