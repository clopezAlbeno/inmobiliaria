import { Router } from "express";
import { crearPropiedad, obtenerPropiedades, obtenerPropiedadPorId, actualizarPropiedad, eliminarPropiedad } from "./propiedad.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticateToken, crearPropiedad);
router.get("/", obtenerPropiedades); // Pública
router.get("/:id", obtenerPropiedadPorId); // Pública
router.put("/:id", authenticateToken, actualizarPropiedad);
router.delete("/:id", authenticateToken, eliminarPropiedad);

export default router;