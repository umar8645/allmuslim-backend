import express from "express";
import { getRSSFeeds } from "../controllers/rssController.js";

const router = express.Router();

/**
 * GET /api/rss
 */
router.get("/", getRSSFeeds);

/**
 * GET /api/rss/status
 */
router.get("/status", (req, res) => {
  res.json({
    rss: "active",
    message: "RSS system running",
  });
});

export default router;