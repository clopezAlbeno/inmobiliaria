const db = require('../../config/mysql');

class UsuarioModel {
    static async create(ip_usuario, pagina_visitada, navegador, sistema_operativo, ubicacion) {
        const sql = `INSERT INTO usuarios (ip_usuario, pagina_visitada, navegador, sistema_operativo, ubicacion) VALUES (?, ?, ?, ?, ?)`;
        return db.execute(sql, [ip_usuario, pagina_visitada, navegador, sistema_operativo, ubicacion]);
    }

    static async getAll() {
        const sql = `SELECT * FROM usuarios`;
        const result = await db.execute(sql);
        return result[0]; // Retorna solo los resultados
    }
    
}



module.exports = UsuarioModel;
