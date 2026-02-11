import express from "express";
import {
  registerFile,
  getFileStatus,
  normalizeFile
} from "../controllers/file.controller.js";

const router = express.Router();

router.post("/register", registerFile);
router.post("/:id/normalize", normalizeFile);
router.get("/:id", getFileStatus);

export default router;
