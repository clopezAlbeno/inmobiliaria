import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    
    // Verificar que el usuario no sea cliente
    if (user.rol === 'cliente') {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    req.user = user;
    next();
  });
};