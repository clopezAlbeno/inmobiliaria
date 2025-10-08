import cloudinary from '../config/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body; // Base64 string
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Subir imagen a Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: 'propiedades',
      public_id: `prop_${uuidv4()}`,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' },
        { format: 'webp' }
      ]
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    });
  } catch (error) {
    console.error('❌ Error subiendo imagen:', error);
    res.status(500).json({ error: 'Error subiendo imagen: ' + error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    
    if (!public_id) {
      return res.status(400).json({ error: 'Public ID is required' });
    }

    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result === 'ok') {
      res.json({ message: 'Imagen eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'Imagen no encontrada' });
    }
  } catch (error) {
    console.error('❌ Error eliminando imagen:', error);
    res.status(500).json({ error: 'Error eliminando imagen' });
  }
};

export const getImages = async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'propiedades/',
      max_results: 50
    });
    
    res.json(result.resources);
  } catch (error) {
    console.error('❌ Error obteniendo imágenes:', error);
    res.status(500).json({ error: 'Error obteniendo imágenes' });
  }
};