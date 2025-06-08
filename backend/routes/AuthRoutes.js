import express from "express";
import { register, login, logout, checkSession } from "../controllers/AuthController.js";
import { verifySession } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifySession, logout);
router.get("/session", checkSession);

export default router;