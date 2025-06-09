import express from "express";
import { register, login, logout, checkAuth, logoutAll, getSessionInfo } from "../controllers/AuthController.js";
import { verifySession } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifySession, logout);
router.post("/logout-all", verifySession, logoutAll);
router.get("/check", checkAuth);
router.get("/session-info", getSessionInfo);

export default router;