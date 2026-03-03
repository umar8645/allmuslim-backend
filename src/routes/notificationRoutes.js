import express from "express";
import { getNotifications } from "../controllers/notificationController.js";

const router = express.Router();

/**
 * GET /api/notifications
 */
router.get("/", getNotifications);

/**
 * GET /api/notifications/ping
 */
router.get("/ping", (req, res) => {
  res.json({ notifications: "alive" });
});

export default router;