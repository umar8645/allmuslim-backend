import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getAuditLogs
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { logAction } from "../middleware/auditMiddleware.js";

const router = express.Router();

// Only admin can access
router.use(protect);
router.use(allowRoles("admin"));

// Users CRUD
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.post("/users", logAction("CREATE"), createUser);
router.put("/users/:id", logAction("UPDATE"), updateUser);
router.delete("/users/:id", logAction("DELETE"), deleteUser);

// Audit logs
router.get("/audit-logs", getAuditLogs);

export default router;