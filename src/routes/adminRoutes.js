import express from "express";
import {
  dashboardStats,
  listUsers
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/stats",
  protect,
  allowRoles("admin", "editor"),
  dashboardStats
);

router.get(
  "/users",
  protect,
  allowRoles("admin"),
  listUsers
);

export default router;