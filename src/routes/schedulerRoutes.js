import express from "express";
import { getSchedulerStatus } from "../jobs/scheduler.js";

const router = express.Router();

/**
 * GET /api/scheduler/status
 */
router.get("/status", (req, res) => {
  res.json({ scheduler: getSchedulerStatus() });
});

export default router;
