import { Router } from "express";
import { uploadImage, deleteImage, getImages } from "./cloudinary.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/upload", authenticateToken, uploadImage);
router.delete("/delete", authenticateToken, deleteImage);
router.get("/images", authenticateToken, getImages);

export default router;