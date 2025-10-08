import Contacto from "./contacto.model.js";

export const crearContacto = async (req, res) => {
  try {
    const contacto = await Contacto.create(req.body);
    res.json(contacto);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
