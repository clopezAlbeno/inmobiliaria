import Propiedad from "./propiedad.model.js";
import PropiedadImagen from "../propiedadImagen/propiedadImagen.model.js";
import Usuario from "../usuario/usuario.model.js";

// Crear propiedad
export const crearPropiedad = async (req, res) => {
  try {
    console.log('📦 Creando propiedad con datos:', req.body);
    
    const { imagenes = [], ...propData } = req.body;
    
    // Validaciones básicas
    if (!propData.titulo || !propData.precio) {
      return res.status(400).json({ error: 'Título y precio son requeridos' });
    }

    // Asegurar que los números sean correctos
    const propiedadData = {
      ...propData,
      precio: parseFloat(propData.precio),
      habitaciones: propData.habitaciones ? parseInt(propData.habitaciones) : null,
      banos: propData.banos ? parseInt(propData.banos) : null,
      estacionamientos: propData.estacionamientos ? parseInt(propData.estacionamientos) : null,
      metros: propData.metros ? parseFloat(propData.metros) : null,
      latitud: propData.latitud ? parseFloat(propData.latitud) : null,
      longitud: propData.longitud ? parseFloat(propData.longitud) : null,
      destacado: Boolean(propData.destacado),
      id_usuario: propData.id_usuario || 1
    };

    console.log('📦 Datos procesados:', propiedadData);

    const propiedad = await Propiedad.create(propiedadData);
    console.log(`✅ Propiedad creada con ID: ${propiedad.id}`);

    // Manejar imágenes si se proporcionan
    if (imagenes && imagenes.length > 0) {
      console.log(`📸 Procesando ${imagenes.length} imágenes`);
      for (const img of imagenes) {
        await PropiedadImagen.create({
          id_propiedad: propiedad.id,
          url_imagen: img.url,
          es_principal: img.es_principal || false,
          orden: img.orden || 0
        });
      }
    }

    // Obtener la propiedad completa con relaciones
    const propiedadCompleta = await Propiedad.findByPk(propiedad.id, {
      include: [
        { 
          model: PropiedadImagen, 
          as: "imagenes" 
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre", "apellido"]
        }
      ]
    });

    res.status(201).json(propiedadCompleta);
  } catch (e) {
    console.error('❌ Error creando propiedad:', e);
    res.status(500).json({ error: 'Error interno del servidor: ' + e.message });
  }
};

// Obtener todas las propiedades
export const obtenerPropiedades = async (req, res) => {
  try {
    console.log('🔍 Obteniendo todas las propiedades');
    
    const propiedades = await Propiedad.findAll({
      include: [
        { 
          model: PropiedadImagen, 
          as: "imagenes" 
        },
        { 
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre", "apellido", "correo", "telefono"]
        }
      ],
      order: [['fecha_publicacion', 'DESC']]
    });
    
    console.log(`✅ ${propiedades.length} propiedades encontradas`);
    res.json(propiedades);
  } catch (e) {
    console.error('❌ Error obteniendo propiedades:', e);
    res.status(500).json({ error: e.message });
  }
};

// Obtener propiedad por ID
export const obtenerPropiedadPorId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Buscando propiedad ID: ${id}`);
    
    const propiedad = await Propiedad.findByPk(id, {
      include: [
        { 
          model: PropiedadImagen, 
          as: "imagenes" 
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre", "apellido", "correo", "telefono"]
        }
      ]
    });
    
    if (!propiedad) {
      console.log(`❌ Propiedad ${id} no encontrada`);
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }
    
    console.log(`✅ Propiedad ${id} encontrada`);
    res.json(propiedad);
  } catch (e) {
    console.error(`❌ Error obteniendo propiedad ${req.params.id}:`, e);
    res.status(500).json({ error: e.message });
  }
};

// Actualizar propiedad
export const actualizarPropiedad = async (req, res) => {
  try {
    const { id } = req.params;
    const { imagenes, ...propData } = req.body;
    
    console.log(`✏️ Actualizando propiedad ID: ${id}`, propData);

    // Preparar datos para actualización
    const updateData = {
      ...propData,
      precio: parseFloat(propData.precio),
      habitaciones: propData.habitaciones ? parseInt(propData.habitaciones) : null,
      banos: propData.banos ? parseInt(propData.banos) : null,
      estacionamientos: propData.estacionamientos ? parseInt(propData.estacionamientos) : null,
      metros: propData.metros ? parseFloat(propData.metros) : null,
      latitud: propData.latitud ? parseFloat(propData.latitud) : null,
      longitud: propData.longitud ? parseFloat(propData.longitud) : null,
      destacado: Boolean(propData.destacado)
    };

    await Propiedad.update(updateData, { 
      where: { id } 
    });

    // Manejar imágenes si se proporcionan
    if (imagenes && imagenes.length) {
      console.log(`🔄 Actualizando ${imagenes.length} imágenes`);
      
      // Eliminar imágenes existentes
      await PropiedadImagen.destroy({ where: { id_propiedad: id } });
      
      // Crear nuevas imágenes
      for (const img of imagenes) {
        await PropiedadImagen.create({
          id_propiedad: id,
          url_imagen: img.url,
          es_principal: img.es_principal || false,
          orden: img.orden || 0
        });
      }
    }

    // Obtener la propiedad actualizada
    const propiedadCompleta = await Propiedad.findByPk(id, {
      include: [
        { 
          model: PropiedadImagen, 
          as: "imagenes" 
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre", "apellido"]
        }
      ]
    });
    
    console.log(`✅ Propiedad ${id} actualizada correctamente`);
    res.json(propiedadCompleta);
  } catch (e) {
    console.error(`❌ Error actualizando propiedad ${req.params.id}:`, e);
    res.status(500).json({ error: e.message });
  }
};

// Eliminar propiedad
export const eliminarPropiedad = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando propiedad ID: ${id}`);
    
    // Eliminar imágenes primero (por la relación foreign key)
    await PropiedadImagen.destroy({ where: { id_propiedad: id } });
    
    // Eliminar la propiedad
    await Propiedad.destroy({ where: { id } });
    
    console.log(`✅ Propiedad ${id} eliminada correctamente`);
    res.json({ message: "Propiedad eliminada" });
  } catch (e) {
    console.error(`❌ Error eliminando propiedad ${req.params.id}:`, e);
    res.status(500).json({ error: e.message });
  }
};