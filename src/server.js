import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

// ROUTES
import rssRoutes from "./routes/rssRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import waaziRoutes from "./routes/waaziRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";

// JOBS
import { startScheduler } from "./jobs/scheduler.js";

dotenv.config();

const app = express();

/* ================= PATH FIX ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= TRUST PROXY (GYARA) ================= */
app.set("trust proxy", 1); // ✅ MUHIMMI – DON RENDER

/* ================= SECURITY ================= */
app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

/* ================= FIREBASE ================= */
const serviceAccountPath = path.join(
  __dirname,
  "config",
  "firebaseServiceAccount.json"
);

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf-8")
  );

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

/* ================= HEALTH ================= */
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/* ================= ROUTES ================= */
app.use("/api/rss", rssRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/waazi", waaziRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/library", libraryRoutes);

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ================= ERROR ================= */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

/* ================= START ================= */
const start = async () => {
  await connectDB();
  startScheduler();

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

start();