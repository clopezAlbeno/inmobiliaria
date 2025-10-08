import express from "express";
import { crearContacto } from "./contacto.controller.js";
const router = express.Router();

router.post("/", crearContacto);

export default router;
