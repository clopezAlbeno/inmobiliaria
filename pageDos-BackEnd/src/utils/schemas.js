const Joi = require('joi');

// Esquemas de validación para usuarios
const registerSchema = Joi.object({
    nombre: Joi.string().required().min(2).max(50)
        .messages({
            'string.empty': 'El nombre es requerido',
            'string.min': 'El nombre debe tener al menos 2 caracteres',
            'string.max': 'El nombre no puede exceder los 50 caracteres'
        }),
    apellido: Joi.string().required().min(2).max(50)
        .messages({
            'string.empty': 'El apellido es requerido',
            'string.min': 'El apellido debe tener al menos 2 caracteres',
            'string.max': 'El apellido no puede exceder los 50 caracteres'
        }),
    correo: Joi.string().required().email()
        .messages({
            'string.empty': 'El correo es requerido',
            'string.email': 'El correo debe ser válido'
        }),
    telefono: Joi.string().required().pattern(/^[0-9+]{8,15}$/)
        .messages({
            'string.empty': 'El teléfono es requerido',
            'string.pattern.base': 'El teléfono debe contener entre 8 y 15 dígitos'
        }),
    contrasena: Joi.string().required().min(6)
        .messages({
            'string.empty': 'La contraseña es requerida',
            'string.min': 'La contraseña debe tener al menos 6 caracteres'
        })
});

const loginSchema = Joi.object({
    correo: Joi.string().required().email()
        .messages({
            'string.empty': 'El correo es requerido',
            'string.email': 'El correo debe ser válido'
        }),
    contrasena: Joi.string().required()
        .messages({
            'string.empty': 'La contraseña es requerida'
        })
});

// Esquema de validación para propiedades
const propertySchema = Joi.object({
    titulo: Joi.string().required().min(5).max(100)
        .messages({
            'string.empty': 'El título es requerido',
            'string.min': 'El título debe tener al menos 5 caracteres',
            'string.max': 'El título no puede exceder los 100 caracteres'
        }),
    descripcion: Joi.string().required().min(20)
        .messages({
            'string.empty': 'La descripción es requerida',
            'string.min': 'La descripción debe tener al menos 20 caracteres'
        }),
    precio: Joi.number().required().min(0)
        .messages({
            'number.base': 'El precio debe ser un número',
            'number.min': 'El precio no puede ser negativo'
        }),
    id_tipo_moneda: Joi.number().required()
        .messages({
            'number.base': 'El tipo de moneda es requerido'
        }),
    id_tipo_propiedad: Joi.number().required()
        .messages({
            'number.base': 'El tipo de propiedad es requerido'
        }),
    id_tipo_medida: Joi.number().required()
        .messages({
            'number.base': 'El tipo de medida es requerido'
        }),
    metros: Joi.number().required().min(1)
        .messages({
            'number.base': 'Los metros deben ser un número',
            'number.min': 'Los metros deben ser mayores a 0'
        }),
    habitaciones: Joi.number().required().min(0)
        .messages({
            'number.base': 'Las habitaciones deben ser un número',
            'number.min': 'Las habitaciones no pueden ser negativas'
        }),
    banos: Joi.number().required().min(0)
        .messages({
            'number.base': 'Los baños deben ser un número',
            'number.min': 'Los baños no pueden ser negativos'
        }),
    estacionamientos: Joi.number().required().min(0)
        .messages({
            'number.base': 'Los estacionamientos deben ser un número',
            'number.min': 'Los estacionamientos no pueden ser negativos'
        }),
    direccion: Joi.string().required()
        .messages({
            'string.empty': 'La dirección es requerida'
        }),
    ciudad: Joi.string().required()
        .messages({
            'string.empty': 'La ciudad es requerida'
        }),
    departamento: Joi.string().required()
        .messages({
            'string.empty': 'El departamento es requerido'
        }),
    pais: Joi.string().required()
        .messages({
            'string.empty': 'El país es requerido'
        }),
    latitud: Joi.number().min(-90).max(90)
        .messages({
            'number.base': 'La latitud debe ser un número',
            'number.min': 'La latitud debe estar entre -90 y 90',
            'number.max': 'La latitud debe estar entre -90 y 90'
        }),
    longitud: Joi.number().min(-180).max(180)
        .messages({
            'number.base': 'La longitud debe ser un número',
            'number.min': 'La longitud debe estar entre -180 y 180',
            'number.max': 'La longitud debe estar entre -180 y 180'
        }),
    tipo_operacion: Joi.string().required().valid('venta', 'alquiler', 'ambos')
        .messages({
            'string.empty': 'El tipo de operación es requerido',
            'any.only': 'El tipo de operación debe ser venta, alquiler o ambos'
        }),
    caracteristicas: Joi.array().items(Joi.number())
        .messages({
            'array.base': 'Las características deben ser un arreglo de IDs'
        }),
    imagenes: Joi.array().items(
        Joi.object({
            url_imagen: Joi.string().required(),
            es_principal: Joi.boolean().default(false)
        })
    ).messages({
        'array.base': 'Las imágenes deben ser un arreglo de objetos'
    })
});

// Esquemas de validación para formularios de contacto
const contactFormSchema = Joi.object({
    nombre: Joi.string().required().min(2).max(50)
        .messages({
            'string.empty': 'El nombre es requerido',
            'string.min': 'El nombre debe tener al menos 2 caracteres',
            'string.max': 'El nombre no puede exceder los 50 caracteres'
        }),
    correo: Joi.string().required().email()
        .messages({
            'string.empty': 'El correo es requerido',
            'string.email': 'El correo debe ser válido'
        }),
    telefono: Joi.string().pattern(/^[0-9+]{8,15}$/)
        .messages({
            'string.pattern.base': 'El teléfono debe contener entre 8 y 15 dígitos'
        }),
    mensaje: Joi.string().required().min(10)
        .messages({
            'string.empty': 'El mensaje es requerido',
            'string.min': 'El mensaje debe tener al menos 10 caracteres'
        })
});

// Funciones de validación
function validateRegister(data) {
    return registerSchema.validate(data, { abortEarly: false });
}

function validateLogin(data) {
    return loginSchema.validate(data, { abortEarly: false });
}

function validateProperty(data) {
    return propertySchema.validate(data, { abortEarly: false });
}

function validateContactForm(data) {
    return contactFormSchema.validate(data, { abortEarly: false });
}

module.exports = {
    validateRegister,
    validateLogin,
    validateProperty,
    validateContactForm
};