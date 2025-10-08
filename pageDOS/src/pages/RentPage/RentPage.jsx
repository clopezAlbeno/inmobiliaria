import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { RentPropertyCard } from "../../components/RentPropertyCard/RentPropertyCard.jsx";
import "./RentPage.css";

export const RentPage = () => {
  const [propertiesData, setPropertiesData] = useState([]); // Estado para datos de API
  const [loading, setLoading] = useState(true); // Para manejar carga
  const [error, setError] = useState(null); // Para errores

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:4000/api/propiedades");
      
      console.log("Datos recibidos:", response.data); // Para debug
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Formato de datos inválido");
      }
        const mappedData = response.data.map((prop) => ({
          id: prop.id,
          title: prop.titulo,
          price: parseFloat(prop.precio),
          currency: "GTQ",
          transactionType: prop.tipo_operacion === "alquiler" ? "EN RENTA" : 
                          prop.tipo_operacion === "venta" ? "EN VENTA" : "AMBOS",
          image: prop.imagenes?.find((img) => img.es_principal)?.url_imagen || 
                 prop.imagenes?.[0]?.url_imagen || "/default-image.jpg",
          bedrooms: prop.habitaciones || 0,
          bathrooms: prop.banos || 0,
          area: parseFloat(prop.metros) || 0,
          description: prop.descripcion || "Sin descripción",
          advisor: prop.usuario?.nombre || "No asignado", // Cambiado de Usuario a usuario
          location: `${prop.ciudad || ""}, ${prop.departamento || ""}`.trim().replace(/^,\s*|,\s*$/g, ''),
          propertyType: prop.tipo_propiedad || "Casa",
          publishDate: prop.fecha_publicacion || new Date().toISOString()
        }));
        setPropertiesData(mappedData);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError(err.response?.data?.error || "Error al cargar las propiedades");
    } finally {
      setLoading(false);
    }
  };
  fetchProperties();
}, []);

  const rentPropertiesData = useMemo(() => 
    propertiesData.filter(property => property.transactionType === "EN RENTA"),
    [propertiesData]
  );

  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    minArea: "",
    maxArea: ""
  });

  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 10;

  const updateFilter = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      location: "",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      minArea: "",
      maxArea: ""
    });
    setCurrentPage(1);
  };

  // Opciones únicas (solo de propiedades en renta)
  const uniqueLocations = [...new Set(rentPropertiesData.map((prop) => prop.location))];
  const uniquePropertyTypes = [...new Set(rentPropertiesData.map((prop) => prop.propertyType))];

  // Filtrar y ordenar
  const filteredProperties = useMemo(() => {
    let filtered = rentPropertiesData.filter((property) => {
      if (filters.location && property.location !== filters.location) return false;
      if (filters.propertyType && property.propertyType !== filters.propertyType) return false;
      if (filters.minPrice && property.price < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) return false;
      if (filters.bedrooms && property.bedrooms < parseInt(filters.bedrooms)) return false;
      if (filters.bathrooms && property.bathrooms < parseInt(filters.bathrooms)) return false;
      if (filters.minArea && property.area < parseFloat(filters.minArea)) return false;
      if (filters.maxArea && property.area > parseFloat(filters.maxArea)) return false;
      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "area-large":
          return b.area - a.area;
        case "area-small":
          return a.area - b.area;
        case "newest":
        default:
          return new Date(b.publishDate) - new Date(a.publishDate);
      }
    });

    return filtered;
  }, [filters, sortBy, rentPropertiesData]);

  // Paginación
  const indexOfLast = currentPage * propertiesPerPage;
  const indexOfFirst = indexOfLast - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  if (loading) return <div>Cargando propiedades...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="rent-page-container">
      <div className="rent-page-header">
        <h1>Propiedades en renta</h1>
        <p>Encuentra la propiedad perfecta para ti</p>
      </div>
      <div className="rent-page-content">
        {/* Filtros */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h2>Filtros</h2>
            <button className="clear-filters-btn" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </div>

          <div className="filter-section">
            <h4>Ubicación</h4>
            <select
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="filter-select"
            >
              <option value="">Todas</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h4>Tipo de propiedad</h4>
            <select
              value={filters.propertyType}
              onChange={(e) => updateFilter("propertyType", e.target.value)}
              className="filter-select"
            >
              <option value="">Todos</option>
              {uniquePropertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h4>Precio</h4>
            <input
              type="number"
              placeholder="Mínimo"
              value={filters.minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              className="filter-input"
            />
            <input
              type="number"
              placeholder="Máximo"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-section">
            <h4>Dormitorios</h4>
            <input
              type="number"
              placeholder="Mínimo"
              value={filters.bedrooms}
              onChange={(e) => updateFilter("bedrooms", e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-section">
            <h4>Baños</h4>
            <input
              type="number"
              placeholder="Mínimo"
              value={filters.bathrooms}
              onChange={(e) => updateFilter("bathrooms", e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-section">
            <h4>Área (m²)</h4>
            <input
              type="number"
              placeholder="Mínimo"
              value={filters.minArea}
              onChange={(e) => updateFilter("minArea", e.target.value)}
              className="filter-input"
            />
            <input
              type="number"
              placeholder="Máximo"
              value={filters.maxArea}
              onChange={(e) => updateFilter("maxArea", e.target.value)}
              className="filter-input"
            />
          </div>
        </aside>

        <main className="properties-list">
          <div className="sort-bar">
            <span>{filteredProperties.length} propiedades en renta encontradas</span>
            <div className="sort-controls">
              <span>Ordenar por:</span>
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
          </div>

          {currentProperties.length > 0 ? (
            <div className="properties-grid">
              {currentProperties.map((property) => (
                <RentPropertyCard
                  key={property.id}
                  {...property}
                  price={property.price.toLocaleString()}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No se encontraron propiedades en renta</h3>
              <p>Intenta ajustar los filtros para ver más resultados</p>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                &laquo; Anterior
              </button>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={currentPage === pageNum ? "pagination-btn active" : "pagination-btn"}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && <span className="pagination-ellipsis">...</span>}
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Siguiente &raquo;
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};