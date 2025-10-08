const UsuarioModel = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validateRegister, validateLogin } = require('../utils/schemas');

class UsuarioController {
    static async register(req, res) {
        try {
            const validationResult = validateRegister(req.body);
            if (validationResult.error) {
                return res.status(400).json({ error: validationResult.error.details[0].message });
            }

            const { nombre, apellido, correo, telefono, contrasena } = req.body;

            // Verificar si el correo ya está registrado
            const existingUser = await UsuarioModel.getByEmail(correo);
            if (existingUser) {
                return res.status(400).json({ error: 'El correo ya está registrado' });
            }

            // Hash de la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contrasena, salt);

            await UsuarioModel.create(nombre, apellido, correo, telefono, hashedPassword);
            res.status(201).json({ message: 'Usuario registrado correctamente' });
        } catch (error) {
            console.error('Error en register:', error);
            res.status(500).json({ error: 'Error al registrar usuario' });
        }
    }

    static async login(req, res) {
        try {
            const validationResult = validateLogin(req.body);
            if (validationResult.error) {
                return res.status(400).json({ error: validationResult.error.details[0].message });
            }

            const { correo, contrasena } = req.body;

            // Verificar si el usuario existe
            const user = await UsuarioModel.getByEmail(correo);
            if (!user) {
                return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
            }

            // Verificar contraseña
            const validPassword = await bcrypt.compare(contrasena, user.contrasena);
            if (!validPassword) {
                return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
            }

            // Crear y firmar el JWT
            const token = jwt.sign(
                { id: user.id, rol: user.rol },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    correo: user.correo,
                    telefono: user.telefono,
                    rol: user.rol
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ error: 'Error al iniciar sesión' });
        }
    }

    static async getProfile(req, res) {
        try {
            const user = await UsuarioModel.getById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // No enviar la contraseña en la respuesta
            delete user.contrasena;
            res.json(user);
        } catch (error) {
            console.error('Error en getProfile:', error);
            res.status(500).json({ error: 'Error al obtener perfil' });
        }
    }

    static async updateProfile(req, res) {
        try {
            const { nombre, apellido, correo, telefono } = req.body;
            
            // Si se está actualizando el correo, verificar que no esté en uso
            if (correo) {
                const existingUser = await UsuarioModel.getByEmail(correo);
                if (existingUser && existingUser.id !== req.user.id) {
                    return res.status(400).json({ error: 'El correo ya está en uso' });
                }
            }

            await UsuarioModel.update(req.user.id, { nombre, apellido, correo, telefono });
            res.json({ message: 'Perfil actualizado correctamente' });
        } catch (error) {
            console.error('Error en updateProfile:', error);
            res.status(500).json({ error: 'Error al actualizar perfil' });
        }
    }

    static async updatePassword(req, res) {
        try {
            const { contrasenaActual, nuevaContrasena } = req.body;

            // Obtener usuario actual
            const user = await UsuarioModel.getById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Verificar contraseña actual
            const validPassword = await bcrypt.compare(contrasenaActual, user.contrasena);
            if (!validPassword) {
                return res.status(400).json({ error: 'Contraseña actual incorrecta' });
            }

            // Hash de la nueva contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(nuevaContrasena, salt);

            await UsuarioModel.updatePassword(req.user.id, hashedPassword);
            res.json({ message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            console.error('Error en updatePassword:', error);
            res.status(500).json({ error: 'Error al actualizar contraseña' });
        }
    }

    static async getAllUsers(req, res) {
        try {
            // Verificar si el usuario es admin
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ error: 'Acceso no autorizado' });
            }

            const users = await UsuarioModel.getAll();
            // No enviar las contraseñas en la respuesta
            users.forEach(user => delete user.contrasena);
            res.json(users);
        } catch (error) {
            console.error('Error en getAllUsers:', error);
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }

    static async deleteUser(req, res) {
        try {
            // Verificar si el usuario es admin
            if (req.user.rol !== 'admin') {
                return res.status(403).json({ error: 'Acceso no autorizado' });
            }

            const { id } = req.params;
            
            // No permitir que se elimine a sí mismo
            if (id === req.user.id) {
                return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
            }

            const user = await UsuarioModel.getById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            await UsuarioModel.delete(id);
            res.json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Error en deleteUser:', error);
            res.status(500).json({ error: 'Error al eliminar usuario' });
        }
    }
}

module.exports = UsuarioController;