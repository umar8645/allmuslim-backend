// src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";

// ROUTES
import rssRoutes from "./routes/rssRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import waaziRoutes from "./routes/waaziRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";
import schedulerRoutes from "./routes/schedulerRoutes.js";
import searchRoutes from "./routes/searchRoutes.js"; // ✅ ADDED

// JOBS
import { startScheduler } from "./jobs/scheduler.js";

dotenv.config();
const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/**
 * ROOT & HEALTH
 */
app.get("/", (req, res) => {
  res.json({
    status: "AllMuslim Backend Running 🚀",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/**
 * API ROUTES
 */
app.use("/api/rss", rssRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/waazi", waaziRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/scheduler", schedulerRoutes);
app.use("/api/search", searchRoutes);

/**
 * 404 HANDLER
 */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/**
 * GLOBAL ERROR HANDLER
 */
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const startServer = async () => {
  try {
    await connectDB();
    startScheduler();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();