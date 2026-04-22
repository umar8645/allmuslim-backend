import express from "express";
import "./services/scheduler.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(apiLimiter);

// Import routes
import authRoutes from "./routes/authRoutes.js";
import lectureRoutes from "./routes/lectureRoutes.js";
import scholarRoutes from "./routes/scholarRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import liveRoutes from "./routes/liveRoutes.js";
import globalRoutes from "./routes/globalRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/scholars", scholarRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/live", liveRoutes);
app.use("/api/global", globalRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorHandler);

export default app;
