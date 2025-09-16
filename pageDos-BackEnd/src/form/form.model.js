const db = require('../../config/mysql');

class FormularioModel {
    static async create(nombre, telefono, correo, empresa, descripcion) {
        const sql = `INSERT INTO formulario (nombre, telefono, correo, empresa, descripcion) VALUES (?, ?, ?, ?, ?)`;
        return db.execute(sql, [nombre, telefono, correo, empresa, descripcion]);
    }

    static async getAll() {
        const sql = `SELECT * FROM formulario`;
        const [rows] = await db.execute(sql);
        return rows;
    }
}

module.exports = FormularioModel;
