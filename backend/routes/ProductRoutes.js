import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getSizes
} from "../controllers/ProductController.js";

import { verifySession } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Endpoint untuk mendapatkan daftar kategori produk
router.get("/categories", getCategories); // publik

// Endpoint untuk mendapatkan ukuran yang tersedia untuk kategori tertentu
router.get("/categories/:category/sizes", getSizes); // publik

router.get("/", getProducts); // publik, bisa filter dengan ?category=deck&size=8.0
router.get("/:id", getProductById); // publik
router.post("/", verifySession, createProduct);
router.put("/:id", verifySession, updateProduct);
router.delete("/:id", verifySession, deleteProduct);

export default router;