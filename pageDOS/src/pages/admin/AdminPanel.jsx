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
    return <div className="admin-loading">Cargando propiedades...</div>;
  }

  return (
    <div className="admin-panel-container">
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

            <div className="properties-grid-admin">
              {properties.map(property => (
                <div key={property.id} className="property-card-admin">
                  <div className="property-image-admin">
                    <img 
                      src={property.imagenes?.[0]?.url_imagen || '/default-property.jpg'} 
                      alt={property.titulo}
                    />
                    <div className="property-badge">
                      {property.tipo_operacion === 'venta' ? 'VENTA' : 'RENTA'}
                    </div>
                  </div>
                  <div className="property-info-admin">
                    <h3>{property.titulo}</h3>
                    <p className="property-price">${property.precio?.toLocaleString()}</p>
                    <p className="property-type">{property.tipo_propiedad}</p>
                    <p className="property-location">
                      <i className="fas fa-map-marker-alt"></i> 
                      {property.ciudad}, {property.departamento}
                    </p>
                    <div className="property-details-admin">
                      {property.habitaciones && <span><i className="fas fa-bed"></i> {property.habitaciones} hab</span>}
                      {property.banos && <span><i className="fas fa-bath"></i> {property.banos} baños</span>}
                      {property.metros && <span><i className="fas fa-ruler-combined"></i> {property.metros} m²</span>}
                    </div>
                    <div className="property-images-count">
                      <i className="fas fa-images"></i> {property.imagenes?.length || 0} imágenes
                    </div>
                    <div className="property-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditProperty(property)}
                      >
                        <i className="fas fa-edit"></i> Editar
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteProperty(property.id)}
                      >
                        <i className="fas fa-trash"></i> Eliminar
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

// Componente de subida de imágenes
const ImageUploader = ({ images, onImagesChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const newImages = [];

    try {
      for (const file of files) {
        // Crear URL temporal para previsualización
        const tempUrl = URL.createObjectURL(file);
        newImages.push({
          url: tempUrl,
          file: file,
          es_principal: images.length === 0 && newImages.length === 0,
          orden: images.length + newImages.length,
          isTemp: true
        });
      }

      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);
    } catch (error) {
      console.error('Error processing images:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = (index) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      es_principal: i === index
    }));
    onImagesChange(updatedImages);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  const handleReorder = (fromIndex, toIndex) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    
    // Actualizar órdenes
    const reorderedImages = updatedImages.map((img, index) => ({
      ...img,
      orden: index
    }));
    
    onImagesChange(reorderedImages);
  };

  return (
    <div className="image-uploader">
      <div className="upload-section">
        <label className="file-input-label">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="file-input"
          />
          <span className="file-input-button">
            <i className="fas fa-cloud-upload-alt"></i>
            {uploading ? 'Subiendo...' : 'Seleccionar Imágenes'}
          </span>
        </label>
        <p className="upload-hint">Puedes seleccionar múltiples imágenes</p>
      </div>

      {images.length > 0 && (
        <div className="images-preview">
          <h4>Imágenes de la propiedad ({images.length})</h4>
          <div className="images-grid">
            {images.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.url} alt={`Preview ${index + 1}`} />
                <div className="image-overlay">
                  <div className="image-actions">
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(index)}
                      className={`primary-btn ${image.es_principal ? 'active' : ''}`}
                    >
                      {image.es_principal ? '⭐ Principal' : 'Hacer Principal'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="remove-btn"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="image-order">
                    <button 
                      type="button"
                      onClick={() => handleReorder(index, index - 1)}
                      disabled={index === 0}
                      className="order-btn"
                    >
                      ↑
                    </button>
                    <span>Orden: {index + 1}</span>
                    <button 
                      type="button"
                      onClick={() => handleReorder(index, index + 1)}
                      disabled={index === images.length - 1}
                      className="order-btn"
                    >
                      ↓
                    </button>
                  </div>
                </div>
                {image.es_principal && <div className="primary-badge">Principal</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente del formulario de propiedad
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

  const [images, setImages] = useState(property?.imagenes || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      
      // Preparar datos para enviar
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
        id_usuario: 1,
        imagenes: images.map((img, index) => ({
          url: img.url,
          es_principal: img.es_principal,
          orden: index
        }))
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
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  name="titulo"
                  placeholder="Ej: Hermosa casa en zona residencial"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  name="descripcion"
                  placeholder="Describe la propiedad en detalle..."
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Precio *</label>
                <input
                  type="number"
                  name="precio"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Tipo y Operación</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Operación *</label>
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
              </div>
              
              <div className="form-group">
                <label>Tipo de Propiedad *</label>
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
          </div>

          <div className="form-section">
            <h3>Características</h3>
            <div className="form-row triple">
              <div className="form-group">
                <label>Habitaciones</label>
                <input
                  type="number"
                  name="habitaciones"
                  placeholder="0"
                  value={formData.habitaciones}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Baños</label>
                <input
                  type="number"
                  name="banos"
                  placeholder="0"
                  value={formData.banos}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Estacionamientos</label>
                <input
                  type="number"
                  name="estacionamientos"
                  placeholder="0"
                  value={formData.estacionamientos}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Metros cuadrados</label>
                <input
                  type="number"
                  name="metros"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.metros}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Ubicación</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  placeholder="Calle, número, colonia"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Ciudad</label>
                <input
                  type="text"
                  name="ciudad"
                  placeholder="Ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Departamento/Estado</label>
                <input
                  type="text"
                  name="departamento"
                  placeholder="Estado o departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>País</label>
                <input
                  type="text"
                  name="pais"
                  placeholder="País"
                  value={formData.pais}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Latitud</label>
                <input
                  type="number"
                  name="latitud"
                  step="0.0000001"
                  placeholder="0.0000000"
                  value={formData.latitud}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Longitud</label>
                <input
                  type="number"
                  name="longitud"
                  step="0.0000001"
                  placeholder="0.0000000"
                  value={formData.longitud}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Imágenes</h3>
            <ImageUploader 
              images={images}
              onImagesChange={setImages}
            />
          </div>

          <div className="form-section">
            <h3>Opciones</h3>
            <div className="form-row">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="destacado"
                    checked={formData.destacado}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  Propiedad destacada
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : (property ? 'Actualizar Propiedad' : 'Crear Propiedad')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};