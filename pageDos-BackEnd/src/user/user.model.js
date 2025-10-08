const db = require('../../config/mysql');

class UsuarioModel {
    static async create(nombre, apellido, correo, telefono, contrasena, rol = 'cliente') {
        const sql = `INSERT INTO usuarios (nombre, apellido, correo, telefono, contrasena, rol, fecha_registro) 
                    VALUES (?, ?, ?, ?, ?, ?, NOW())`;
        return db.execute(sql, [nombre, apellido, correo, telefono, contrasena, rol]);
    }

    static async getAll() {
        const sql = `SELECT id, nombre, apellido, correo, telefono, rol, fecha_registro FROM usuarios`;
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async getById(id) {
        const sql = `SELECT id, nombre, apellido, correo, telefono, rol, fecha_registro 
                    FROM usuarios WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }

    static async getByEmail(correo) {
        const sql = `SELECT id, nombre, apellido, correo, telefono, contrasena, rol, fecha_registro 
                    FROM usuarios WHERE correo = ?`;
        const [rows] = await db.execute(sql, [correo]);
        return rows[0];
    }

    static async update(id, { nombre, apellido, correo, telefono }) {
        const sql = `UPDATE usuarios 
                    SET nombre = ?, apellido = ?, correo = ?, telefono = ?
                    WHERE id = ?`;
        return db.execute(sql, [nombre, apellido, correo, telefono, id]);
    }

    static async updatePassword(id, contrasena) {
        const sql = `UPDATE usuarios SET contrasena = ? WHERE id = ?`;
        return db.execute(sql, [contrasena, id]);
    }

    static async delete(id) {
        const sql = `DELETE FROM usuarios WHERE id = ?`;
        return db.execute(sql, [id]);
    }
}

module.exports = UsuarioModel;
