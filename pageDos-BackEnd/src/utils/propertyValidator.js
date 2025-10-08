const validateProperty = (data) => {
    const errors = [];

    // Validaciones obligatorias
    if (!data.titulo || data.titulo.trim().length < 5) {
        errors.push('El título es requerido y debe tener al menos 5 caracteres');
    }

    if (!data.descripcion || data.descripcion.trim().length < 20) {
        errors.push('La descripción es requerida y debe tener al menos 20 caracteres');
    }

    if (!data.precio || isNaN(data.precio) || data.precio <= 0) {
        errors.push('El precio debe ser un número válido mayor a 0');
    }

    if (!data.id_moneda || isNaN(data.id_moneda)) {
        errors.push('El tipo de moneda es requerido');
    }

    if (!data.id_tipo_propiedad || isNaN(data.id_tipo_propiedad)) {
        errors.push('El tipo de propiedad es requerido');
    }

    if (!data.ubicacion || data.ubicacion.trim().length < 5) {
        errors.push('La ubicación es requerida y debe tener al menos 5 caracteres');
    }

    // Validaciones opcionales con formato
    if (data.dormitorios && (isNaN(data.dormitorios) || data.dormitorios < 0)) {
        errors.push('El número de dormitorios debe ser un número válido');
    }

    if (data.banos && (isNaN(data.banos) || data.banos < 0)) {
        errors.push('El número de baños debe ser un número válido');
    }

    if (data.area && (isNaN(data.area) || data.area <= 0)) {
        errors.push('El área debe ser un número válido mayor a 0');
    }

    if (data.estado && !['disponible', 'vendido', 'alquilado', 'reservado'].includes(data.estado)) {
        errors.push('El estado de la propiedad no es válido');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    validateProperty
};