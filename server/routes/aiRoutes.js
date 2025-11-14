import express from "express";
import multer from "multer";
import { summarizePDF } from "../controllers/aiController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/summarize", upload.single("file"), summarizePDF);

export default router;
