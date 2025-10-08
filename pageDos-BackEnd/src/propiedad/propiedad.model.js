const db = require('../../config/mysql');

class PropiedadModel {
    static async create(data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const sqlPropiedad = `
                INSERT INTO propiedad 
                (titulo, descripcion, precio, id_tipo_moneda, id_tipo_propiedad, 
                id_tipo_medida, metros, habitaciones, banos, estacionamientos,
                direccion, ciudad, departamento, pais, latitud, longitud,
                tipo_operacion, fecha_publicacion, id_usuario) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
            `;
            const valuesPropiedad = [
                data.titulo,
                data.descripcion,
                data.precio,
                data.id_tipo_moneda,
                data.id_tipo_propiedad,
                data.id_tipo_medida,
                data.metros,
                data.habitaciones,
                data.banos,
                data.estacionamientos,
                data.direccion,
                data.ciudad,
                data.departamento,
                data.pais,
                data.latitud,
                data.longitud,
                data.tipo_operacion,
                data.id_usuario
            ];

            const [result] = await connection.execute(sqlPropiedad, valuesPropiedad);
            const idPropiedad = result.insertId;

            // Insertar imágenes si existen
            if (data.imagenes && Array.isArray(data.imagenes)) {
                const sqlImagen = `
                    INSERT INTO propiedad_imagen 
                    (id_propiedad, url_imagen, es_principal, orden) 
                    VALUES (?, ?, ?, ?)
                `;
                
                for (let i = 0; i < data.imagenes.length; i++) {
                    const imagen = data.imagenes[i];
                    await connection.execute(sqlImagen, [
                        idPropiedad,
                        imagen.url,
                        imagen.es_principal || false,
                        imagen.orden || i
                    ]);
                }
            }

            // Insertar características si existen
            if (data.caracteristicas && Array.isArray(data.caracteristicas)) {
                const sqlCaracteristica = `
                    INSERT INTO caracteristica_propiedad 
                    (id_propiedad, nombre, valor) 
                    VALUES (?, ?, ?)
                `;
                
                for (const caracteristica of data.caracteristicas) {
                    await connection.execute(sqlCaracteristica, [
                        idPropiedad,
                        caracteristica.nombre,
                        caracteristica.valor
                    ]);
                }
            }

            await connection.commit();
            return idPropiedad;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Obtener todas las propiedades con filtros
    static async getAll(filters = {}) {
        let sql = `
            SELECT DISTINCT p.*, 
                m.codigo AS moneda, 
                tp.nombre AS tipo_propiedad, 
                tm.nombre AS medida,
                GROUP_CONCAT(DISTINCT pi.url_imagen) as imagenes,
                GROUP_CONCAT(DISTINCT CONCAT(cp.nombre, ':', cp.valor)) as caracteristicas
            FROM propiedad p
            LEFT JOIN tipo_moneda m ON p.id_moneda = m.id_moneda
            LEFT JOIN tipo_propiedad tp ON p.id_tipo_propiedad = tp.id_tipo_propiedad
            LEFT JOIN tipo_medida tm ON p.id_tipo_medida = tm.id_tipo_medida
            LEFT JOIN propiedad_imagen pi ON p.id_propiedad = pi.id_propiedad
            LEFT JOIN caracteristica_propiedad cp ON p.id_propiedad = cp.id_propiedad
            WHERE 1=1
        `;
        
        const values = [];

        if (filters.precio_min) {
            sql += ' AND p.precio >= ?';
            values.push(filters.precio_min);
        }

        if (filters.precio_max) {
            sql += ' AND p.precio <= ?';
            values.push(filters.precio_max);
        }

        if (filters.tipo_propiedad) {
            sql += ' AND p.id_tipo_propiedad = ?';
            values.push(filters.tipo_propiedad);
        }

        if (filters.estado) {
            sql += ' AND p.estado = ?';
            values.push(filters.estado);
        }

        if (filters.dormitorios) {
            sql += ' AND p.dormitorios >= ?';
            values.push(filters.dormitorios);
        }

        if (filters.texto_busqueda) {
            sql += ` AND (
                p.titulo LIKE ? OR 
                p.descripcion LIKE ? OR 
                p.ubicacion LIKE ?
            )`;
            const busqueda = `%${filters.texto_busqueda}%`;
            values.push(busqueda, busqueda, busqueda);
        }

        sql += ' GROUP BY p.id_propiedad';
        
        // Ordenamiento
        sql += ' ORDER BY ' + (filters.ordenar_por || 'p.fecha_publicacion') + ' ' + 
               (filters.orden || 'DESC');

        // Paginación
        if (filters.limite) {
            sql += ' LIMIT ?';
            values.push(parseInt(filters.limite));

            if (filters.pagina) {
                sql += ' OFFSET ?';
                values.push((parseInt(filters.pagina) - 1) * parseInt(filters.limite));
            }
        }

        const [rows] = await db.execute(sql, values);
        
        // Procesar los resultados
        return rows.map(row => ({
            ...row,
            imagenes: row.imagenes ? row.imagenes.split(',') : [],
            caracteristicas: row.caracteristicas ? 
                row.caracteristicas.split(',').reduce((acc, curr) => {
                    const [nombre, valor] = curr.split(':');
                    acc[nombre] = valor;
                    return acc;
                }, {}) : {}
        }));
    }

    // Obtener una propiedad por ID
    static async getById(id) {
        const sql = `
            SELECT p.*, 
                m.codigo AS moneda, 
                tp.nombre AS tipo_propiedad, 
                tm.nombre AS medida,
                GROUP_CONCAT(DISTINCT pi.url_imagen) as imagenes,
                GROUP_CONCAT(DISTINCT CONCAT(cp.nombre, ':', cp.valor)) as caracteristicas
            FROM propiedad p
            LEFT JOIN tipo_moneda m ON p.id_moneda = m.id_moneda
            LEFT JOIN tipo_propiedad tp ON p.id_tipo_propiedad = tp.id_tipo_propiedad
            LEFT JOIN tipo_medida tm ON p.id_tipo_medida = tm.id_tipo_medida
            LEFT JOIN propiedad_imagen pi ON p.id_propiedad = pi.id_propiedad
            LEFT JOIN caracteristica_propiedad cp ON p.id_propiedad = cp.id_propiedad
            WHERE p.id_propiedad = ?
            GROUP BY p.id_propiedad
        `;
        
        const [rows] = await db.execute(sql, [id]);
        if (rows.length === 0) return null;

        const propiedad = rows[0];
        return {
            ...propiedad,
            imagenes: propiedad.imagenes ? propiedad.imagenes.split(',') : [],
            caracteristicas: propiedad.caracteristicas ? 
                propiedad.caracteristicas.split(',').reduce((acc, curr) => {
                    const [nombre, valor] = curr.split(':');
                    acc[nombre] = valor;
                    return acc;
                }, {}) : {}
        };
    }

    // Actualizar propiedad
    static async update(id, data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const sqlPropiedad = `
                UPDATE propiedad 
                SET titulo=?, descripcion=?, precio=?, id_moneda=?, 
                    id_tipo_propiedad=?, dormitorios=?, banos=?, area=?, 
                    id_tipo_medida=?, ubicacion=?, estado=?, asesor=?,
                    destacado=?
                WHERE id_propiedad=?
            `;
            const valuesPropiedad = [
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
                data.destacado,
                id
            ];

            await connection.execute(sqlPropiedad, valuesPropiedad);

            // Actualizar imágenes si existen
            if (data.imagenes && Array.isArray(data.imagenes)) {
                // Eliminar imágenes existentes
                await connection.execute('DELETE FROM propiedad_imagen WHERE id_propiedad = ?', [id]);

                // Insertar nuevas imágenes
                const sqlImagen = `
                    INSERT INTO propiedad_imagen 
                    (id_propiedad, url_imagen, es_principal, orden) 
                    VALUES (?, ?, ?, ?)
                `;
                
                for (let i = 0; i < data.imagenes.length; i++) {
                    const imagen = data.imagenes[i];
                    await connection.execute(sqlImagen, [
                        id,
                        imagen.url,
                        imagen.es_principal || false,
                        imagen.orden || i
                    ]);
                }
            }

            // Actualizar características si existen
            if (data.caracteristicas && Array.isArray(data.caracteristicas)) {
                // Eliminar características existentes
                await connection.execute('DELETE FROM caracteristica_propiedad WHERE id_propiedad = ?', [id]);

                // Insertar nuevas características
                const sqlCaracteristica = `
                    INSERT INTO caracteristica_propiedad 
                    (id_propiedad, nombre, valor) 
                    VALUES (?, ?, ?)
                `;
                
                for (const caracteristica of data.caracteristicas) {
                    await connection.execute(sqlCaracteristica, [
                        id,
                        caracteristica.nombre,
                        caracteristica.valor
                    ]);
                }
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Eliminar propiedad
    static async delete(id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Eliminar imágenes
            await connection.execute('DELETE FROM propiedad_imagen WHERE id_propiedad = ?', [id]);
            
            // Eliminar características
            await connection.execute('DELETE FROM caracteristica_propiedad WHERE id_propiedad = ?', [id]);
            
            // Eliminar propiedad
            await connection.execute('DELETE FROM propiedad WHERE id_propiedad = ?', [id]);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Buscar propiedades destacadas
    static async getDestacadas(limite = 6) {
        const sql = `
            SELECT p.*, 
                m.codigo AS moneda, 
                tp.nombre AS tipo_propiedad,
                (SELECT url_imagen FROM propiedad_imagen pi 
                 WHERE pi.id_propiedad = p.id_propiedad AND pi.es_principal = 1 
                 LIMIT 1) as imagen_principal
            FROM propiedad p
            LEFT JOIN tipo_moneda m ON p.id_moneda = m.id_moneda
            LEFT JOIN tipo_propiedad tp ON p.id_tipo_propiedad = tp.id_tipo_propiedad
            WHERE p.destacado = 1
            ORDER BY p.fecha_publicacion DESC
            LIMIT ?
        `;
        
        const [rows] = await db.execute(sql, [limite]);
        return rows;
    }
}

module.exports = PropiedadModel;
