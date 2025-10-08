import express from "express";
import { registrarUsuario, loginUsuario, obtenerUsuarios } from "./usuario.controller.js";
const router = express.Router();

router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.get("/", obtenerUsuarios);

export default router;
