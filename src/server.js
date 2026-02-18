import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import { startScheduler } from "./jobs/scheduler.js";
import "./workers/contentWorker.js"; // ✅ IMPORTANT: Start BullMQ Worker

import rssRoutes from "./routes/rssRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import waaziRoutes from "./routes/waaziRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";

dotenv.config();

const app = express();

/* =========================
   GLOBAL MIDDLEWARE
========================= */

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: "Too many requests, please try again later."
  })
);

/* =========================
   ROOT ROUTE
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "AllMuslim Backend is running 🚀",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime()
  });
});

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

/* =========================
   API ROUTES
========================= */

app.use("/api/rss", rssRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/waazi", waaziRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/library", libraryRoutes);

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

/* =========================
   SERVER START
========================= */

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    startScheduler();
    console.log("✅ Scheduler Running with BullMQ");

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

/* =========================
   GRACEFUL SHUTDOWN
========================= */

process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received. Shutting down...");
  process.exit(0);
});

startServer();