import express from "express";
import { enviarFormulario } from "./form.controller.js";
const router = express.Router();

router.post("/", enviarFormulario);

export default router;
