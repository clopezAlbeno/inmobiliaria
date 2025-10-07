const db = require('../../config/mysql');

class PropiedadModel {
    // Crear propiedad
    static async create(data) {
        const sql = `
            INSERT INTO propiedad 
            (titulo, descripcion, precio, id_moneda, id_tipo_propiedad, dormitorios, banos, area, id_tipo_medida, ubicacion, estado, asesor) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            data.titulo,
            data.descripcion,
            data.precio,
            data.id_moneda,
            data.id_tipo_propiedad,
            data.dormitorios,
            data.banos,
            data.area,
            data.id_tipo_medida,
            data.ubicacion,
            data.estado,
            data.asesor
        ];
        return db.execute(sql, values);
    }

    // Obtener todas las propiedades
    static async getAll() {
        const sql = `
            SELECT p.id_propiedad, p.titulo, p.descripcion, p.precio, m.codigo AS moneda, 
                   tp.nombre AS tipo_propiedad, p.dormitorios, p.banos, p.area, tm.nombre AS medida, 
                   p.ubicacion, p.estado, p.fecha_publicacion, p.asesor
            FROM propiedad p
            LEFT JOIN tipo_moneda m ON p.id_moneda = m.id_moneda
            LEFT JOIN tipo_propiedad tp ON p.id_tipo_propiedad = tp.id_tipo_propiedad
            LEFT JOIN tipo_medida tm ON p.id_tipo_medida = tm.id_tipo_medida
            ORDER BY p.fecha_publicacion DESC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    // Obtener una propiedad por ID
    static async getById(id) {
        const sql = `
            SELECT p.*, m.codigo AS moneda, tp.nombre AS tipo_propiedad, tm.nombre AS medida
            FROM propiedad p
            LEFT JOIN tipo_moneda m ON p.id_moneda = m.id_moneda
            LEFT JOIN tipo_propiedad tp ON p.id_tipo_propiedad = tp.id_tipo_propiedad
            LEFT JOIN tipo_medida tm ON p.id_tipo_medida = tm.id_tipo_medida
            WHERE p.id_propiedad = ?
        `;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }

    // Actualizar propiedad
    static async update(id, data) {
        const sql = `
            UPDATE propiedad 
            SET titulo=?, descripcion=?, precio=?, id_moneda=?, id_tipo_propiedad=?, dormitorios=?, banos=?, area=?, id_tipo_medida=?, ubicacion=?, estado=?, asesor=?
            WHERE id_propiedad=?
        `;
        const values = [
            data.titulo,
            data.descripcion,
            data.precio,
            data.id_moneda,
            data.id_tipo_propiedad,
            data.dormitorios,
            data.banos,
            data.area,
            data.id_tipo_medida,
            data.ubicacion,
            data.estado,
            data.asesor,
            id
        ];
        return db.execute(sql, values);
    }

    // Eliminar propiedad
    static async delete(id) {
        const sql = `DELETE FROM propiedad WHERE id_propiedad = ?`;
        return db.execute(sql, [id]);
    }
}

module.exports = PropiedadModel;
