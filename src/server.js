import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import compression from "compression";
import responseTime from "response-time";

import connectDB from "./config/db.js";
import { startScheduler } from "./jobs/scheduler.js";
import "./workers/contentWorker.js";

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
app.use(compression());
app.use(responseTime());
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
   ROOT
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
   ROUTES
========================= */

app.use("/api/rss", rssRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/waazi", waaziRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/library", libraryRoutes);

/* =========================
   404
========================= */

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
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
   START SERVER
========================= */

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
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

/* =========================
   GRACEFUL SHUTDOWN
========================= */

const shutdown = () => {
  console.log("🛑 Shutting down gracefully...");

  if (server) {
    server.close(() => {
      console.log("💤 Server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

startServer();