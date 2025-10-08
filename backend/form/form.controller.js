import Formulario from "./form.model.js";

export const enviarFormulario = async (req, res) => {
  try {
    const form = await Formulario.create(req.body);
    res.json(form);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
