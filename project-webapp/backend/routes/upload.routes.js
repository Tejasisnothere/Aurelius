import express from "express";
import multer from "multer";
import { uploadAudio } from "../controllers/upload.controller.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

router.post(
  "/audio",
  upload.single("audio"),
  uploadAudio
);

export default router;
