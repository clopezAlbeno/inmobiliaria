import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminPanel.css';

export const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const navigate = useNavigate();

  // Verificar autenticación
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token || !userData) {
      navigate('/admin');
      return;
    }

    setUser(JSON.parse(userData));
    fetchProperties();
  }, [navigate]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/propiedades');
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:4000/api/propiedades/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error al eliminar la propiedad');
    }
  };

  if (loading) {
    return <div className="admin-loading">Cargando...</div>;
  }

  return (
    <div className="admin-panel-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Panel Administrativo</h1>
          <div className="admin-user-info">
            <span>Bienvenido, {user?.nombre}</span>
            <span className="user-role">({user?.rol})</span>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Navegación */}
      <nav className="admin-nav">
        <button 
          className={`nav-btn ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => setActiveTab('properties')}
        >
          🏠 Propiedades
        </button>
        <button 
          className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Usuarios
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="admin-main">
        {activeTab === 'properties' && (
          <div className="properties-section">
            <div className="section-header">
              <h2>Gestión de Propiedades</h2>
              <button 
                className="add-property-btn"
                onClick={() => {
                  setEditingProperty(null);
                  setShowPropertyForm(true);
                }}
              >
                + Agregar Propiedad
              </button>
            </div>

            <div className="properties-list">
              {properties.map(property => (
                <div key={property.id} className="property-card-admin">
                  <div className="property-image-admin">
                    <img 
                      src={property.imagenes?.[0]?.url_imagen || '/default-property.jpg'} 
                      alt={property.titulo}
                    />
                  </div>
                  <div className="property-info-admin">
                    <h3>{property.titulo}</h3>
                    <p className="property-price">${property.precio?.toLocaleString()}</p>
                    <p className="property-type">{property.tipo_operacion} - {property.tipo_propiedad}</p>
                    <p className="property-location">{property.ciudad}, {property.departamento}</p>
                    <div className="property-details-admin">
                      <span>{property.habitaciones} hab</span>
                      <span>{property.banos} baños</span>
                      <span>{property.metros} m²</span>
                    </div>
                    <div className="property-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditProperty(property)}
                      >
                        Editar
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteProperty(property.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Gestión de Usuarios</h2>
            <p>Módulo de usuarios en desarrollo...</p>
          </div>
        )}
      </main>

      {/* Modal de Formulario de Propiedad */}
      {showPropertyForm && (
        <PropertyForm 
          property={editingProperty}
          onClose={() => {
            setShowPropertyForm(false);
            setEditingProperty(null);
          }}
          onSave={() => {
            setShowPropertyForm(false);
            setEditingProperty(null);
            fetchProperties();
          }}
        />
      )}
    </div>
  );
};

// Componente del formulario de propiedad (COMPLETO)
const PropertyForm = ({ property, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    titulo: property?.titulo || '',
    descripcion: property?.descripcion || '',
    precio: property?.precio || '',
    tipo_operacion: property?.tipo_operacion || 'venta',
    tipo_propiedad: property?.tipo_propiedad || 'Casa',
    habitaciones: property?.habitaciones || '',
    banos: property?.banos || '',
    estacionamientos: property?.estacionamientos || '',
    metros: property?.metros || '',
    direccion: property?.direccion || '',
    ciudad: property?.ciudad || '',
    departamento: property?.departamento || '',
    pais: property?.pais || 'México',
    latitud: property?.latitud || '',
    longitud: property?.longitud || '',
    destacado: property?.destacado || false,
    id_usuario: 1
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      
      // Preparar datos (convertir números y manejar valores vacíos)
      const submitData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio) || 0,
        tipo_operacion: formData.tipo_operacion,
        tipo_propiedad: formData.tipo_propiedad,
        habitaciones: formData.habitaciones ? parseInt(formData.habitaciones) : null,
        banos: formData.banos ? parseInt(formData.banos) : null,
        estacionamientos: formData.estacionamientos ? parseInt(formData.estacionamientos) : null,
        metros: formData.metros ? parseFloat(formData.metros) : null,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        departamento: formData.departamento,
        pais: formData.pais,
        latitud: formData.latitud ? parseFloat(formData.latitud) : null,
        longitud: formData.longitud ? parseFloat(formData.longitud) : null,
        destacado: Boolean(formData.destacado),
        id_usuario: 1
      };

      console.log('Enviando datos:', submitData);

      if (property) {
        // Editar propiedad existente
        await axios.put(`http://localhost:4000/api/propiedades/${property.id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Crear nueva propiedad
        await axios.post('http://localhost:4000/api/propiedades', submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving property:', error);
      setError(error.response?.data?.error || error.message || 'Error al guardar la propiedad');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="property-form-modal">
        <div className="modal-header">
          <h2>{property ? 'Editar Propiedad' : 'Agregar Propiedad'}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="property-form">
          {error && <div className="form-error">{error}</div>}
          
          <div className="form-section">
            <h3>Información Básica</h3>
            <div className="form-row">
              <input
                type="text"
                name="titulo"
                placeholder="Título de la propiedad *"
                value={formData.titulo}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <textarea
                name="descripcion"
                placeholder="Descripción detallada *"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <input
                type="number"
                name="precio"
                step="0.01"
                placeholder="Precio *"
                value={formData.precio}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Tipo y Operación</h3>
            <div className="form-row">
              <select
                name="tipo_operacion"
                value={formData.tipo_operacion}
                onChange={handleChange}
                required
              >
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
                <option value="ambos">Ambos</option>
              </select>
              
              <select
                name="tipo_propiedad"
                value={formData.tipo_propiedad}
                onChange={handleChange}
                required
              >
                <option value="Casa">Casa</option>
                <option value="Departamento">Departamento</option>
                <option value="Condominio">Condominio</option>
                <option value="Terreno">Terreno</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Características</h3>
            <div className="form-row triple">
              <input
                type="number"
                name="habitaciones"
                placeholder="Habitaciones"
                value={formData.habitaciones}
                onChange={handleChange}
                min="0"
              />
              <input
                type="number"
                name="banos"
                placeholder="Baños"
                value={formData.banos}
                onChange={handleChange}
                min="0"
              />
              <input
                type="number"
                name="estacionamientos"
                placeholder="Estacionamientos"
                value={formData.estacionamientos}
                onChange={handleChange}
                min="0"
              />
            </div>
            
            <div className="form-row">
              <input
                type="number"
                name="metros"
                step="0.01"
                placeholder="Metros cuadrados"
                value={formData.metros}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Ubicación</h3>
            <div className="form-row">
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-row">
              <input
                type="text"
                name="ciudad"
                placeholder="Ciudad"
                value={formData.ciudad}
                onChange={handleChange}
              />
              <input
                type="text"
                name="departamento"
                placeholder="Departamento/Estado"
                value={formData.departamento}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-row">
              <input
                type="text"
                name="pais"
                placeholder="País"
                value={formData.pais}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <input
                type="number"
                name="latitud"
                step="0.0000001"
                placeholder="Latitud"
                value={formData.latitud}
                onChange={handleChange}
              />
              <input
                type="number"
                name="longitud"
                step="0.0000001"
                placeholder="Longitud"
                value={formData.longitud}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Opciones</h3>
            <div className="form-row checkbox-row">
              <label>
                <input
                  type="checkbox"
                  name="destacado"
                  checked={formData.destacado}
                  onChange={handleChange}
                />
                Propiedad destacada
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : (property ? 'Actualizar' : 'Crear Propiedad')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};