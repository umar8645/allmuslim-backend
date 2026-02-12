import { Router } from "express";
import { getNotifications } from "../controllers/notificationController.js";

const router = Router();

// GET /api/notifications
router.get("/", getNotifications);

export default router;
