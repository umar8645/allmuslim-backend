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

/* 🔥 UNIFIED ROUTES */
import feedRoutes from "./routes/feedRoutes.js";
import waaziRoutes from "./routes/waaziRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
const app = express();

/* =============================
   TRUST PROXY (Render Safe)
============================= */
app.set("trust proxy", 1);

/* =============================
   SECURITY + PERFORMANCE
============================= */
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
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* =============================
   ROOT
============================= */
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "AllMuslim Aggregator Engine 🚀",
    uptime: process.uptime(),
  });
});

/* =============================
   HEALTH CHECK
============================= */
app.get("/api/health", async (req, res) => {
  const mongoStatus =
    mongoose.connection.readyState === 1
      ? "connected"
      : "disconnected";

  const redisStatus =
    process.env.REDIS_URL && redis?.status === "ready"
      ? "connected"
      : "disabled";

  res.json({
    status: "OK",
    uptime: process.uptime(),
    mongo: mongoStatus,
    redis: redisStatus,
    memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
    timestamp: Date.now(),
  });
});

/* =============================
   API ROUTES
============================= */

/* 🔥 Unified Feed */
app.use("/api/feed", feedRoutes);

/* Optional specific filters */
app.use("/api/waazi", waaziRoutes);
app.use("/api/notifications", notificationRoutes);

/* =============================
   404 HANDLER
============================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =============================
   GLOBAL ERROR HANDLER
============================= */
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

/* =============================
   SERVER START
============================= */

const PORT = process.env.PORT || 4000;
let server;

const startServer = async () => {
  try {
    await connectDB();
    console.log("🗄 MongoDB Connected");

    if (process.env.REDIS_URL) {
      console.log("🟢 Redis detected — starting workers & scheduler");

      await import("./workers/contentWorker.js");
      console.log("👷 Worker started");

      startScheduler();
      console.log("⏰ Scheduler started");

      const { scrapeQueue } = await import("./queues/scrapeQueue.js");
      await scrapeQueue.add("initial-run", {});
      console.log("⚡ Initial scrape triggered");

    } else {
      console.log("⚠️ REDIS_URL not set — Workers disabled");
    }

    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

/* =============================
   PROCESS SAFETY
============================= */

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION 💥", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION 💥", err);
});

/* =============================
   GRACEFUL SHUTDOWN
============================= */

const shutdown = async () => {
  console.log("🛑 Shutting down...");

  try {
    await mongoose.connection.close();
    console.log("🗄 MongoDB closed");

    if (process.env.REDIS_URL && redis) {
      await redis.quit();
      console.log("🧠 Redis closed");
    }

    if (server) {
      server.close(() => {
        console.log("💤 Server closed");
        process.exit(0);
      });
    }
  } catch (err) {
    console.error("Shutdown error:", err);
    process.exit(1);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

startServer();