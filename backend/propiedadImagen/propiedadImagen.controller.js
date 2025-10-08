import PropiedadImagen from "./propiedadImagen.model.js";

export const agregarImagen = async (req, res) => {
  try {
    const imagen = await PropiedadImagen.create(req.body);
    res.json(imagen);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
