import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./RentPropertyCard.css";

export const RentPropertyCard = ({
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
    <div className="rent-property-card">
      <div className="rent-property-image">
        <Link to={`/property/${id}`}>
          <img src={image} alt={title} />
        </Link>
      </div>
      <div className="rent-property-info">
        <h3 className="rent-property-title">
          {title}
          <span
            className={`rent-transaction-type ${
              transactionType === "EN RENTA" ? "renta" : "venta"
            }`}
          >
            {transactionType}
          </span>
        </h3>
        <p className="rent-property-price">
          {currency} {price}
        </p>
        <p className="rent-property-description">{description}</p>

        <div className="rent-property-details">
          {bedrooms && <span className="detail-item-rent">{bedrooms} dormitorios</span>}
          {bathrooms && <span className="detail-item-rent">{bathrooms} baños</span>}
          {area && <span className="detail-item-rent">{area} m²</span>}
        </div>

        {advisor && <p className="rent-property-advisor">Asesor: {advisor}</p>}

        <Link to={`/property/${id}`} className="rent-detail-btn">
          Ver detalles →
        </Link>
      </div>
    </div>
  );
};

RentPropertyCard.propTypes = {
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

RentPropertyCard.defaultProps = {
  bedrooms: null,
  bathrooms: null,
  area: null,
  description: "Sin descripción disponible",
  advisor: "No asignado"
};
