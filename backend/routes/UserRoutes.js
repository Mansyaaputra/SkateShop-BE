import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";

import { verifySession } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/", verifySession, getUsers);
router.get("/:id", verifySession, getUserById);
router.post("/", verifySession, createUser);
router.put("/:id", verifySession, updateUser);
router.delete("/:id", verifySession, deleteUser);

export default router;