import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./SalesPropertyCard.css";

export const SalesPropertyCard = ({
  id,
  title,
  price,
  currency,
  transactionType,
  image,
  bedrooms,
  bathrooms,
  area,
  description,
  advisor
}) => {
  return (
    <div className="sales-property-card">
      <div className="sales-property-image">
        <Link to={`/property/${id}`}>
          <img src={image} alt={title} />
        </Link>
      </div>
      <div className="sales-property-info">
        <h3 className="sales-property-title">
          {title}
          <span
            className={`sales-transaction-type ${
              transactionType === "EN RENTA" ? "renta" : "venta"
            }`}
          >
            {transactionType}
          </span>
        </h3>
        <p className="sales-property-price">
          {currency} {price}
        </p>
        <p className="sales-property-description">{description}</p>

        <div className="sales-property-details">
          {bedrooms && <span className="detail-item-sales">{bedrooms} dormitorios</span>}
          {bathrooms && <span className="detail-item-sales">{bathrooms} baños</span>}
          {area && <span className="detail-item-sales">{area} m²</span>}
        </div>

        {advisor && <p className="sales-property-advisor">Asesor: {advisor}</p>}

        <Link to={`/property/${id}`} className="sales-detail-btn">
          Ver detalles →
        </Link>
      </div>
    </div>
  );
};

SalesPropertyCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currency: PropTypes.string.isRequired,
  transactionType: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  bedrooms: PropTypes.number,
  bathrooms: PropTypes.number,
  area: PropTypes.number,
  description: PropTypes.string,
  advisor: PropTypes.string
};

SalesPropertyCard.defaultProps = {
  bedrooms: null,
  bathrooms: null,
  area: null,
  description: "Sin descripción disponible",
  advisor: "No asignado"
};