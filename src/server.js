import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";

import rssRoutes from "./routes/rssRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import waaziRoutes from "./routes/waaziRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";

import { startScheduler } from "./jobs/scheduler.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
  })
);

app.get("/", (req, res) => {
  res.json({
    status: "AllMuslim Backend Running 🚀",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
  });
});

app.use("/api/rss", rssRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/waazi", waaziRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/library", libraryRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
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
    console.error("Server failed to start:", error);
  }
};

startServer();