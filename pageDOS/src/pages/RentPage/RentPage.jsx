import React from 'react';
import { RentPropertyCard } from '../../components/RentPropertyCard/RentPropertyCard.jsx';
import apartamento1 from '../../assets/apartamento1.png';
import apartamento2 from '../../assets/apartamento2.png';
import './RentPage.css';

const dummyRentProperties = [
    {
        id: 1,
        title: 'Casa en Renta en La Cañada zona 14',
        price: '4,000',
        currency: 'US$',
        transactionType: 'EN RENTA',
        image: apartamento1,
        bedrooms: 4,
        bathrooms: 2,
        area: '400',
        description: 'Casa en Condominio en Zona 14, Guatemala',
        advisor: 'Carmen Coloma'
    },
    {
        id: 2,
        title: 'Bodega en Renta - Complejo Industrial Boca del Monte',
        price: '30,000',
        currency: 'US$',
        transactionType: 'EN RENTA',
        image: apartamento2,
        area: '4,020.09',
        description: 'Bodega en Villa Canales',
        advisor: 'Carmen Coloma'
    },
];

export const RentPage = () => {
    return (
        <div className="rent-page-container">
            <div className="rent-page-header">
                <h1>Propiedades en renta</h1>
            </div>
            <div className="rent-page-content">
                <aside className="filters-sidebar">
                    <h2>Filtros</h2>
                    <div className="filter-section">
                        <h4>Ubicación</h4>
                        {/* aquii agregar un input o un dropdown */}
                    </div>
                    <div className="filter-section">
                        <h4>Tipo de propiedad</h4>
                    </div>
                    <div className="filter-section">
                        <h4>Renta</h4>
                    </div>
                    <div className="filter-section">
                        <h4>Dormitorios</h4>
                    </div>
                    <div className="filter-section">
                        <h4>Baños</h4>
                    </div>
                    <div className="filter-section">
                        <h4>Superficie total</h4>
                    </div>
                    <div className="filter-section">
                        <h4>Terreno</h4>
                    </div>
                </aside>
                <main className="properties-list">
                    <div className="sort-bar">
                        <span>Últimos publicados</span>
                        <select>
                            <option>Ordenar por...</option>
                        </select>
                    </div>
                    {dummyRentProperties.map((property) => (
                        <RentPropertyCard
                            key={property.id}
                            {...property}
                        />
                    ))}
                </main>
            </div>
        </div>
    );
};