import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cron from "node-cron";

import connectDB from "./config/database.js";
import admin from "./config/firebase.js";

// Routes
import lectureRoutes from "./routes/lectureRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import globalSearchRoutes from "./routes/globalRoutes.js";
import liveRoutes from "./routes/liveRoutes.js";
import downloadRoutes from "./routes/download.js";
import historyRoutes from "./routes/historyRoutes.js";
import scholarRoutes from "./routes/scholarRoutes.js";

import { authMiddleware } from "./middleware/authMiddleware.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// ✅ Duba environment variables
const requiredEnv = ["OPENAI_API_KEY", "OPENAI_MODEL", "YOUTUBE_API_KEYS", "MONGO_URI", "JWT_SECRET", "REDIS_URL"];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ ${key} missing in .env`);
    process.exit(1);
  }
}
console.log("✅ Environment variables loaded successfully");

// Express setup
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

// Connect DB
connectDB();

// Root endpoint
app.get("/", (req, res) => {
  res.json({ name: "AllMuslim API", status: "running" });
});

// ✅ Protected routes (auth required)
app.use("/api/history", authMiddleware(["user","admin"]), historyRoutes);
app.use("/api/download", authMiddleware(["user","admin"]), downloadRoutes);

// ✅ Public routes (no auth)
app.use("/api/auth", authRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/search", globalSearchRoutes);
app.use("/api/live", liveRoutes);
app.use("/api/scholars", scholarRoutes);

// Error handler
app.use(errorHandler);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ AllMuslim Backend running on port ${PORT}`);
});

// Cron jobs (disabled for now)
// cron.schedule("0 * * * *", async () => { await fetchYouTubeLectures(); });
// cron.schedule("30 * * * *", async () => { await fetchRSSLectures(); });
