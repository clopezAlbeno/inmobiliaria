import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

export const AdminLogin = () => {
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/api/usuarios/login', formData);
      
      // Verificar que el usuario sea admin o asesor
      const userData = response.data.usuario || response.data;
      
      if (userData.rol === 'cliente') {
        setError('No tienes permisos para acceder al panel administrativo');
        return;
      }

      // Guardar token y datos en localStorage
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      
      navigate('/admin/panel');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Panel Administrativo</h1>
          <p>Inicia sesión para gestionar propiedades</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="admin-error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              placeholder="admin@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>Acceso restringido para administradores y asesores</p>
        </div>
      </div>
    </div>
  );
};