import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "./usuario.model.js";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, correo, telefono, contrasena, rol } = req.body;
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const hashed = await bcrypt.hash(contrasena, 10);
    const nuevo = await Usuario.create({ 
      nombre, 
      apellido, 
      correo, 
      telefono, 
      contrasena: hashed, 
      rol: rol || 'asesor' 
    });
    
    // No devolver la contraseña
    const usuarioResponse = {
      id: nuevo.id,
      nombre: nuevo.nombre,
      apellido: nuevo.apellido,
      correo: nuevo.correo,
      telefono: nuevo.telefono,
      rol: nuevo.rol,
      fecha_registro: nuevo.fecha_registro
    };
    
    res.status(201).json(usuarioResponse);
  } catch (e) {
    console.error('Error registrando usuario:', e);
    res.status(500).json({ error: e.message });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    
    if (!correo || !contrasena) {
      return res.status(400).json({ error: "Correo y contraseña son requeridos" });
    }

    const user = await Usuario.findOne({ where: { correo } });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ 
      id: user.id, 
      rol: user.rol,
      correo: user.correo 
    }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: "1d" });

    // Devolver datos del usuario (sin contraseña)
    const userData = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      telefono: user.telefono,
      rol: user.rol,
      fecha_registro: user.fecha_registro
    };

    res.json({ 
      token, 
      usuario: userData 
    });
  } catch (e) {
    console.error('Error en login:', e);
    res.status(500).json({ error: e.message });
  }
};

export const obtenerUsuarios = async (_, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['contrasena'] }
    });
    res.json(usuarios);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};