import { useState, useMemo } from 'react';
import { RentPropertyCard } from '../../components/RentPropertyCard/RentPropertyCard.jsx';
import apartamento1 from '../../assets/apartamento1.png';
import apartamento2 from '../../assets/apartamento2.png';
import './RentPage.css';

const dummyRentProperties = [
    {
        id: 1,
        title: 'Casa en Renta en La Cañada zona 14',
        price: 4000,
        currency: 'US$',
        transactionType: 'EN RENTA',
        image: apartamento1,
        bedrooms: 4,
        bathrooms: 2,
        area: 400,
        location: 'Zona 14',
        propertyType: 'Casa',
        description: 'Casa en Condominio en Zona 14, Guatemala',
        advisor: 'Carmen Coloma',
        publishDate: new Date('2024-01-15')
    },
    {
        id: 2,
        title: 'Bodega en Renta - Complejo Industrial Boca del Monte',
        price: 30000,
        currency: 'US$',
        transactionType: 'EN RENTA',
        image: apartamento2,
        area: 4020.09,
        location: 'Villa Canales',
        propertyType: 'Bodega',
        description: 'Bodega en Villa Canales',
        advisor: 'Carmen Coloma',
        publishDate: new Date('2024-01-20')
    },
    // Añado más propiedades de ejemplo para probar el filtrado
    {
        id: 3,
        title: 'Apartamento en Renta Zona 10',
        price: 2500,
        currency: 'US$',
        transactionType: 'EN RENTA',
        image: apartamento1,
        bedrooms: 2,
        bathrooms: 2,
        area: 120,
        location: 'Zona 10',
        propertyType: 'Apartamento',
        description: 'Moderno apartamento en zona exclusiva',
        advisor: 'María González',
        publishDate: new Date('2024-01-25')
    },
    {
        id: 4,
        title: 'Casa en Renta Zona 15',
        price: 3500,
        currency: 'US$',
        transactionType: 'EN RENTA',
        image: apartamento2,
        bedrooms: 3,
        bathrooms: 3,
        area: 250,
        location: 'Zona 15',
        propertyType: 'Casa',
        description: 'Casa familiar con jardín',
        advisor: 'Juan Pérez',
        publishDate: new Date('2024-01-30')
    }
];

export const RentPage = () => {
    // Estados para los filtros
    const [filters, setFilters] = useState({
        location: '',
        propertyType: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
        bathrooms: '',
        minArea: '',
        maxArea: ''
    });
    
    const [sortBy, setSortBy] = useState('newest');

    // Función para actualizar filtros
    const updateFilter = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    // Función para limpiar filtros
    const clearFilters = () => {
        setFilters({
            location: '',
            propertyType: '',
            minPrice: '',
            maxPrice: '',
            bedrooms: '',
            bathrooms: '',
            minArea: '',
            maxArea: ''
        });
    };

    // Obtener opciones únicas para los dropdowns
    const uniqueLocations = [...new Set(dummyRentProperties.map(prop => prop.location))];
    const uniquePropertyTypes = [...new Set(dummyRentProperties.map(prop => prop.propertyType))];

    // Filtrar propiedades usando useMemo para optimización
    const filteredProperties = useMemo(() => {
        let filtered = dummyRentProperties.filter(property => {
            // Filtro por ubicación
            if (filters.location && property.location !== filters.location) {
                return false;
            }

            // Filtro por tipo de propiedad
            if (filters.propertyType && property.propertyType !== filters.propertyType) {
                return false;
            }

            // Filtro por precio mínimo
            if (filters.minPrice && property.price < parseInt(filters.minPrice)) {
                return false;
            }

            // Filtro por precio máximo
            if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) {
                return false;
            }

            // Filtro por dormitorios
            if (filters.bedrooms && property.bedrooms !== parseInt(filters.bedrooms)) {
                return false;
            }

            // Filtro por baños
            if (filters.bathrooms && property.bathrooms !== parseInt(filters.bathrooms)) {
                return false;
            }

            // Filtro por área mínima
            if (filters.minArea && property.area < parseFloat(filters.minArea)) {
                return false;
            }

            // Filtro por área máxima
            if (filters.maxArea && property.area > parseFloat(filters.maxArea)) {
                return false;
            }

            return true;
        });

        // Ordenar resultados
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'area-large':
                    return b.area - a.area;
                case 'area-small':
                    return a.area - b.area;
                case 'newest':
                default:
                    return new Date(b.publishDate) - new Date(a.publishDate);
            }
        });

        return filtered;
    }, [filters, sortBy]);

    return (
        <div className="rent-page-container">
            <div className="rent-page-header">
                <h1>Propiedades en renta</h1>
            </div>
            <div className="rent-page-content">
                <aside className="filters-sidebar">
                    <div className="filters-header">
                        <h2>Filtros</h2>
                        <button 
                            className="clear-filters-btn"
                            onClick={clearFilters}
                        >
                            Limpiar filtros
                        </button>
                    </div>

                    <div className="filter-section">
                        <h4>Ubicación</h4>
                        <select 
                            value={filters.location}
                            onChange={(e) => updateFilter('location', e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Todas las ubicaciones</option>
                            {uniqueLocations.map(location => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-section">
                        <h4>Tipo de propiedad</h4>
                        <select 
                            value={filters.propertyType}
                            onChange={(e) => updateFilter('propertyType', e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Todos los tipos</option>
                            {uniquePropertyTypes.map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-section">
                        <h4>Renta (US$)</h4>
                        <div className="price-inputs">
                            <input
                                type="number"
                                placeholder="Precio mín."
                                value={filters.minPrice}
                                onChange={(e) => updateFilter('minPrice', e.target.value)}
                                className="filter-input"
                            />
                            <input
                                type="number"
                                placeholder="Precio máx."
                                value={filters.maxPrice}
                                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                                className="filter-input"
                            />
                        </div>
                    </div>

                    <div className="filter-section">
                        <h4>Dormitorios</h4>
                        <select 
                            value={filters.bedrooms}
                            onChange={(e) => updateFilter('bedrooms', e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Cualquier cantidad</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5+</option>
                        </select>
                    </div>

                    <div className="filter-section">
                        <h4>Baños</h4>
                        <select 
                            value={filters.bathrooms}
                            onChange={(e) => updateFilter('bathrooms', e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Cualquier cantidad</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4+</option>
                        </select>
                    </div>

                    <div className="filter-section">
                        <h4>Superficie (m²)</h4>
                        <div className="area-inputs">
                            <input
                                type="number"
                                placeholder="Área mín."
                                value={filters.minArea}
                                onChange={(e) => updateFilter('minArea', e.target.value)}
                                className="filter-input"
                            />
                            <input
                                type="number"
                                placeholder="Área máx."
                                value={filters.maxArea}
                                onChange={(e) => updateFilter('maxArea', e.target.value)}
                                className="filter-input"
                            />
                        </div>
                    </div>
                </aside>

                <main className="properties-list">
                    <div className="sort-bar">
                        <span>
                            {filteredProperties.length} propiedades encontradas
                        </span>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="newest">Más recientes</option>
                            <option value="price-low">Precio: menor a mayor</option>
                            <option value="price-high">Precio: mayor a menor</option>
                            <option value="area-large">Área: mayor a menor</option>
                            <option value="area-small">Área: menor a mayor</option>
                        </select>
                    </div>

                    {filteredProperties.length > 0 ? (
                        <div className="properties-grid">
                            {filteredProperties.map((property) => (
                                <RentPropertyCard
                                    key={property.id}
                                    {...property}
                                    price={property.price.toLocaleString()}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <h3>No se encontraron propiedades</h3>
                            <p>Intenta ajustar los filtros para ver más resultados.</p>
                            <button 
                                className="clear-filters-btn"
                                onClick={clearFilters}
                            >
                                Limpiar todos los filtros
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};