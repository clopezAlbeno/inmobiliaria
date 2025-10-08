const db = require('../../config/mysql');

class ContactoModel {
    static async createFormularioContacto(data) {
        const sql = `INSERT INTO formulario_contacto 
                    (nombre, correo, telefono, mensaje, fecha_envio) 
                    VALUES (?, ?, ?, ?, NOW())`;
        const values = [data.nombre, data.correo, data.telefono, data.mensaje];
        return db.execute(sql, values);
    }

    static async createContactoPropiedad(data) {
        const sql = `INSERT INTO contacto_propiedad 
                    (id_propiedad, nombre, correo, telefono, mensaje, fecha_envio) 
                    VALUES (?, ?, ?, ?, ?, NOW())`;
        const values = [data.id_propiedad, data.nombre, data.correo, data.telefono, data.mensaje];
        return db.execute(sql, values);
    }

    static async getAllFormulariosContacto() {
        const sql = `SELECT * FROM formulario_contacto ORDER BY fecha_envio DESC`;
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async getAllContactosPropiedad(idPropiedad) {
        const sql = `SELECT * FROM contacto_propiedad 
                    WHERE id_propiedad = ? 
                    ORDER BY fecha_envio DESC`;
        const [rows] = await db.execute(sql, [idPropiedad]);
        return rows;
    }

    static async getFormularioContactoById(id) {
        const sql = `SELECT * FROM formulario_contacto WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }

    static async getContactoPropiedadById(id) {
        const sql = `SELECT * FROM contacto_propiedad WHERE id = ?`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }

    static async deleteFormularioContacto(id) {
        const sql = `DELETE FROM formulario_contacto WHERE id = ?`;
        return db.execute(sql, [id]);
    }

    static async deleteContactoPropiedad(id) {
        const sql = `DELETE FROM contacto_propiedad WHERE id = ?`;
        return db.execute(sql, [id]);
    }
}

module.exports = ContactoModel;