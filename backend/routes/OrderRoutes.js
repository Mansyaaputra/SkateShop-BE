import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getOrdersByUser, // tambahkan ini
} from "../controllers/OrderController.js";

import { verifySession } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/", verifySession, getOrders);
router.get("/:id", verifySession, getOrderById);
router.post("/", verifySession, createOrder);
router.put("/:id", verifySession, updateOrder);
router.delete("/:id", verifySession, deleteOrder);
router.patch("/:id/status", verifySession, updateOrderStatus);

// Route baru untuk history by user
router.get("/user/:userId", verifySession, getOrdersByUser);

export default router;