const db = require('../../config/mysql');

class CurrencyTypeModel {
    static async getAll() {
        const sql = `SELECT * FROM tipo_moneda`;
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async getById(id) {
        const sql = `SELECT * FROM tipo_moneda WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }

    static async create(codigo, nombre) {
        const sql = `INSERT INTO tipo_moneda (codigo, nombre) VALUES (?, ?)`;
        return db.execute(sql, [codigo, nombre]);
    }

    static async update(id, codigo, nombre) {
        const sql = `UPDATE tipo_moneda SET codigo = ?, nombre = ? WHERE id = ?`;
        return db.execute(sql, [codigo, nombre, id]);
    }

    static async delete(id) {
        const sql = `DELETE FROM tipo_moneda WHERE id = ?`;
        return db.execute(sql, [id]);
    }
}

module.exports = CurrencyTypeModel;