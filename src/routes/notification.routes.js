// src/routes/notification.routes.js
import express from "express";
import {
  listNotifications,
  markRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/:userId", listNotifications);
router.patch("/:id/read", markRead);

export default router;