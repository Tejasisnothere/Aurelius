import express from "express";
import multer from "multer";

import { protect } from "../middlewares/auth.middleware.js";
import {uploadCSV, getReviewsByProduct, deleteReview} from "../controllers/review.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-csv", protect, upload.single("file"), uploadCSV);
router.get("/:productId", protect, getReviewsByProduct);
router.delete("/:id", protect, deleteReview);

export default router;