import express from "express";

import {createProduct, getAllProducts, updateProduct, deleteProduct} from "../controllers/product.controller.js";

import {protect} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createProduct);
router.get("/", protect, getAllProducts);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;