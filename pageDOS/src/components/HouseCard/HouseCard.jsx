import React from 'react';
import './HouseCard.css'; 
import { Link } from 'react-router-dom';

export const HouseCard = ({
    title,
    price,
    currency,
    transactionType,
    image,
    bedrooms,
    bathrooms,
    area
}) => {
    
    return (
        <div className="property-card">
            <Link to="/property/123" className="property-image-link">
                <img src={image} alt={title} className="property-image" />
            </Link>
            <div className="property-info">
                <h3 className="property-title">{title}</h3>
                <p className="property-price">
                    {currency} {price}
                    <span className={`transaction-type ${transactionType === 'EN VENTA' ? 'venta' : 'renta'}`}>
                        {transactionType}
                    </span>
                </p>
                <div className="property-details">
                    {bedrooms && (
                        <span className="detail-item">
                            <i className="fas fa-bed"></i> {bedrooms} dorm
                        </span>
                    )}
                    {bathrooms && (
                        <span className="detail-item">
                            <i className="fas fa-bath"></i> {bathrooms} baños
                        </span>
                    )}
                    {area && (
                        <span className="detail-item">
                            <i className="fas fa-ruler-combined"></i> {area} m²
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};