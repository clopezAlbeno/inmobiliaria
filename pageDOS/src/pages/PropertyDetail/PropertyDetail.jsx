// PropertyDetail.jsx
import { useParams, Link } from "react-router-dom";
import propertiesData from "../../data/properties.json";
import "./PropertyDetail.css";

export const PropertyDetail = () => {
  const { id } = useParams();
  const property = propertiesData.find((p) => p.id === parseInt(id));

  if (!property) {
    return (
      <div className="property-detail-container">
        <h2>❌ Propiedad no encontrada</h2>
        <Link to="/rentas" className="back-btn">
          ← Volver a propiedades
        </Link>
      </div>
    );
  }

  return (
    <div className="property-detail-container">
      <div className="property-detail-header">
        <div className="property-title-section">
          <h1>{property.title}</h1>
          <span className={`property-transaction-type ${property.transactionType === "EN RENTA" ? "renta" : "venta"}`}>
            {property.transactionType}
          </span>
        </div>
        <p className="property-price">
          {property.currency} {property.price.toLocaleString()}
          {property.transactionType === "EN RENTA" ? "/mes" : ""}
        </p>
        <p className="property-address">
          <i className="fas fa-map-marker-alt"></i> {property.address}
        </p>
      </div>

      <div className="property-detail-content">
        <div className="property-image-gallery">
          <img src={property.image} alt={property.title} className="main-image" />
          <div className="image-thumbnails">
            <img src={property.image} alt="Vista 1" />
            <img src={property.image.replace('apartamento1', 'apartamento2') || property.image.replace('apartamento2', 'apartamento1')} alt="Vista 2" />
          </div>
        </div>

        <div className="property-info">
          <div className="property-highlights">
            <div className="highlight-item">
              <i className="fas fa-bed"></i>
              <span>{property.bedrooms} Dormitorios</span>
            </div>
            <div className="highlight-item">
              <i className="fas fa-bath"></i>
              <span>{property.bathrooms} Baños</span>
            </div>
            <div className="highlight-item">
              <i className="fas fa-ruler-combined"></i>
              <span>{property.area} m²</span>
            </div>
            {property.landArea > 0 && (
              <div className="highlight-item">
                <i className="fas fa-vector-square"></i>
                <span>{property.landArea} m² Terreno</span>
              </div>
            )}
          </div>

          <div className="property-details-section">
            <h2>Detalles de la propiedad</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Ubicación:</span>
                <span className="detail-value">{property.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Tipo:</span>
                <span className="detail-value">{property.propertyType}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Dormitorios:</span>
                <span className="detail-value">{property.bedrooms}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Baños:</span>
                <span className="detail-value">{property.bathrooms}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Área construida:</span>
                <span className="detail-value">{property.area} m²</span>
              </div>
              {property.landArea > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Área de terreno:</span>
                  <span className="detail-value">{property.landArea} m²</span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">Asesor:</span>
                <span className="detail-value">{property.advisor}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Publicado el:</span>
                <span className="detail-value">{new Date(property.publishDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="property-features">
            <h3>Características</h3>
            <div className="features-list">
              {property.features.map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="property-description">
            <h3>Descripción</h3>
            <p>{property.description}</p>
          </div>

          <div className="property-contact">
            <h3>Contactar al asesor</h3>
            <div className="contact-info">
              <p><strong>{property.advisor}</strong></p>
              <p><i className="fas fa-phone"></i> {property.phone}</p>
            </div>
            <button className="contact-btn">
              <i className="fas fa-envelope"></i> Contactar ahora
            </button>
          </div>

          <Link to="/rentas" className="back-btn">
            ← Volver a propiedades
          </Link>
        </div>
      </div>
    </div>
  );
};