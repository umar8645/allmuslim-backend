import express from "express";
import { register, login, refreshToken, forgotPassword, resetPassword, verifyEmail } from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refreshToken);
router.post("/forgot", forgotPassword);
router.put("/reset/:token", resetPassword);
router.get("/verify/:token", verifyEmail);

export default router;
