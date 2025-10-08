import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import propiedadRoutes from "./propiedad/propiedad.routes.js";
import usuarioRoutes from "./usuario/usuario.routes.js";
import contactoRoutes from "./contacto/contacto.routes.js";
import formularioRoutes from "./form/form.routes.js";
import propiedadImagenRoutes from "./propiedadImagen/propiedadImagen.routes.js";
import cloudinaryRoutes from "./cloudinary/cloudinary.routes.js"; // NUEVO

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Aumentar límite para imágenes
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Rutas
app.use("/api/propiedades", propiedadRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/contacto", contactoRoutes);
app.use("/api/formulario", formularioRoutes);
app.use("/api/propiedad-imagen", propiedadImagenRoutes);
app.use("/api/cloudinary", cloudinaryRoutes); // NUEVO

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));