const db = require('../../config/mysql');

class PropertyFeatureModel {
    static async getAll() {
        const sql = `SELECT * FROM caracteristica_propiedad`;
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async getById(id) {
        const sql = `SELECT * FROM caracteristica_propiedad WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }

    static async create(nombre) {
        const sql = `INSERT INTO caracteristica_propiedad (nombre) VALUES (?)`;
        return db.execute(sql, [nombre]);
    }

    static async update(id, nombre) {
        const sql = `UPDATE caracteristica_propiedad SET nombre = ? WHERE id = ?`;
        return db.execute(sql, [nombre, id]);
    }

    static async delete(id) {
        const sql = `DELETE FROM caracteristica_propiedad WHERE id = ?`;
        return db.execute(sql, [id]);
    }

    static async getByPropertyId(propertyId) {
        const sql = `SELECT cp.* 
                    FROM caracteristica_propiedad cp
                    INNER JOIN propiedad_caracteristica pc ON cp.id = pc.id_caracteristica
                    WHERE pc.id_propiedad = ?`;
        const [rows] = await db.execute(sql, [propertyId]);
        return rows;
    }

    static async addToProperty(propertyId, featureId) {
        const sql = `INSERT INTO propiedad_caracteristica (id_propiedad, id_caracteristica) VALUES (?, ?)`;
        return db.execute(sql, [propertyId, featureId]);
    }

    static async removeFromProperty(propertyId, featureId) {
        const sql = `DELETE FROM propiedad_caracteristica 
                    WHERE id_propiedad = ? AND id_caracteristica = ?`;
        return db.execute(sql, [propertyId, featureId]);
    }
}

module.exports = PropertyFeatureModel;