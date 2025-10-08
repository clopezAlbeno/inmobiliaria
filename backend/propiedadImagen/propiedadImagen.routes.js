import express from "express";
import { agregarImagen } from "./propiedadImagen.controller.js";
const router = express.Router();

router.post("/", agregarImagen);

export default router;
