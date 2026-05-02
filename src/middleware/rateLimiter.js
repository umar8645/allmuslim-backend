import rateLimit from "express-rate-limit";

// ✅ General API limiter
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

// ✅ Special limiter for login/register (anti-brute force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                  // only 10 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "⚠ Too many login/register attempts, please try again later."
  }
});
