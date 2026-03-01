import express from "express";
import {
  login,
  register,
  refreshToken,
  logout
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * =====================
 * AUTH ROUTES
 * =====================
 */

// login (admin / editor)
router.post("/login", login);

// refresh access token
router.post("/refresh", refreshToken);

// logout (revoke refresh token)
router.post("/logout", protect, logout);

// only admin can register users
router.post(
  "/register",
  protect,
  allowRoles("admin"),
  register
);

export default router;