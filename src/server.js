import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cron from "node-cron";

import connectDB from "./config/database.js";
import admin from "./config/firebase.js";

// Routes (daidai da sunayen fayilolin da ke cikin src/routes/)
import lectureRoutes from "./routes/lectureRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import globalSearchRoutes from "./routes/globalRoutes.js";
import liveRoutes from "./routes/liveRoutes.js";
import downloadRoutes from "./routes/download.js";
import historyRoutes from "./routes/historyRoutes.js";
import scholarRoutes from "./routes/scholarRoutes.js";

import { fetchYouTubeLectures } from "./crawlers/youtubeCrawler.js";
import { fetchRSSLectures } from "./crawlers/rssCrawler.js";

import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Duba environment variables
const requiredEnv = ["OPENAI_API_KEY","YOUTUBE_API_KEYS","MONGO_URI","JWT_SECRET"];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`${key} missing in .env`);
    process.exit(1);
  }
}

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

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/search", globalSearchRoutes);
app.use("/api/live", liveRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/scholars", scholarRoutes);

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("✅ AllMuslim Backend running on port " + PORT);
});

// Cron jobs
cron.schedule("0 * * * *", async () => { await fetchYouTubeLectures(); });
cron.schedule("30 * * * *", async () => { await fetchRSSLectures(); });
