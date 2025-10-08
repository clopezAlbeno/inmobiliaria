const db = require('../../config/mysql');

class PropertyTypeModel {
    static async getAll() {
        const sql = `SELECT * FROM tipo_propiedad`;
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async getById(id) {
        const sql = `SELECT * FROM tipo_propiedad WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }

    static async create(nombre) {
        const sql = `INSERT INTO tipo_propiedad (nombre) VALUES (?)`;
        return db.execute(sql, [nombre]);
    }

    static async update(id, nombre) {
        const sql = `UPDATE tipo_propiedad SET nombre = ? WHERE id = ?`;
        return db.execute(sql, [nombre, id]);
    }

    static async delete(id) {
        const sql = `DELETE FROM tipo_propiedad WHERE id = ?`;
        return db.execute(sql, [id]);
    }
}

module.exports = PropertyTypeModel;