const db = require('../../config/mysql');

class PropiedadImagenModel {
    static async create(idPropiedad, urlImagen, esPrincipal = false) {
        const sql = `INSERT INTO propiedad_imagen (id_propiedad, url_imagen, es_principal) 
                    VALUES (?, ?, ?)`;
        return db.execute(sql, [idPropiedad, urlImagen, esPrincipal]);
    }

    static async getAllByPropertyId(idPropiedad) {
        const sql = `SELECT * FROM propiedad_imagen WHERE id_propiedad = ?`;
        const [rows] = await db.execute(sql, [idPropiedad]);
        return rows;
    }

    static async getPrincipalByPropertyId(idPropiedad) {
        const sql = `SELECT * FROM propiedad_imagen 
                    WHERE id_propiedad = ? AND es_principal = true 
                    LIMIT 1`;
        const [rows] = await db.execute(sql, [idPropiedad]);
        return rows[0];
    }

    static async update(id, { urlImagen, esPrincipal }) {
        const sql = `UPDATE propiedad_imagen 
                    SET url_imagen = ?, es_principal = ?
                    WHERE id = ?`;
        return db.execute(sql, [urlImagen, esPrincipal, id]);
    }

    static async delete(id) {
        const sql = `DELETE FROM propiedad_imagen WHERE id = ?`;
        return db.execute(sql, [id]);
    }

    static async deleteAllByPropertyId(idPropiedad) {
        const sql = `DELETE FROM propiedad_imagen WHERE id_propiedad = ?`;
        return db.execute(sql, [idPropiedad]);
    }

    static async setPrincipal(idImagen, idPropiedad) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Remove principal flag from all images of this property
            await connection.execute(
                'UPDATE propiedad_imagen SET es_principal = false WHERE id_propiedad = ?',
                [idPropiedad]
            );

            // Set the selected image as principal
            await connection.execute(
                'UPDATE propiedad_imagen SET es_principal = true WHERE id = ?',
                [idImagen]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = PropiedadImagenModel;