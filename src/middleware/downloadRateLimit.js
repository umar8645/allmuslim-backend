// src/middleware/downloadRateLimit.js
import rateLimit from "express-rate-limit";

export const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5, // max 5 downloads
  keyGenerator: (req) => req.user.id,
  message: {
    error: "Ka wuce iyakar download. Jira kadan."
  }
});