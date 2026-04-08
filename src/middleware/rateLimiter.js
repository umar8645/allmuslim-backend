import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,                 // max requests per IP
  standardHeaders: true,    // show rate limit info in headers
  legacyHeaders: false,     // disable old headers
  message: {
    success: false,
    message: "⚠ Too many requests from this IP, please try again later."
  }
});
