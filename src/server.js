import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import compression from "compression";
import responseTime from "response-time";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import redis from "./config/redis.js";
import { startScheduler } from "./jobs/scheduler.js";
import "./workers/contentWorker.js";

import rssRoutes from "./routes/rssRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import waaziRoutes from "./routes/waaziRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";

dotenv.config();
const app = express();

app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(responseTime());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10kb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

/* ROOT */
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "AllMuslim Backend is running 🚀",
    uptime: process.uptime()
  });
});

/* ENTERPRISE HEALTH */
app.get("/api/health", (req, res) => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  const redisStatus =
    redis.status === "ready" ? "connected" : "disconnected";

  res.json({
    status: "OK",
    uptime: process.uptime(),
    mongo: mongoStatus,
    redis: redisStatus,
    memory: process.memoryUsage().rss,
    timestamp: Date.now()
  });
});

/* ROUTES */
app.use("/api/rss", rssRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/waazi", waaziRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/library", libraryRoutes);

/* 404 */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;
let server;

const startServer = async () => {
  try {
    await connectDB();
    startScheduler();

    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

/* PROCESS SAFETY */
process.on("uncaughtException", err => {
  console.error("UNCAUGHT EXCEPTION 💥", err);
});

process.on("unhandledRejection", err => {
  console.error("UNHANDLED REJECTION 💥", err);
});

/* GRACEFUL SHUTDOWN */
const shutdown = async () => {
  console.log("🛑 Shutting down...");

  await mongoose.connection.close();
  await redis.quit();

  if (server) {
    server.close(() => {
      console.log("💤 Server closed");
      process.exit(0);
    });
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

startServer();