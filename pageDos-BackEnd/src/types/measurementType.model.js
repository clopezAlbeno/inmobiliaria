const db = require('../../config/mysql');

class MeasurementTypeModel {
    static async getAll() {
        const sql = `SELECT * FROM tipo_medida`;
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async getById(id) {
        const sql = `SELECT * FROM tipo_medida WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }

    static async create(nombre) {
        const sql = `INSERT INTO tipo_medida (nombre) VALUES (?)`;
        return db.execute(sql, [nombre]);
    }

    static async update(id, nombre) {
        const sql = `UPDATE tipo_medida SET nombre = ? WHERE id = ?`;
        return db.execute(sql, [nombre, id]);
    }

    static async delete(id) {
        const sql = `DELETE FROM tipo_medida WHERE id = ?`;
        return db.execute(sql, [id]);
    }
}

module.exports = MeasurementTypeModel;