import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { apiLimiter } from "./src/middleware/rateLimiter.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(apiLimiter);

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import lectureRoutes from "./src/routes/lectureRoutes.js";
import scholarRoutes from "./src/routes/scholarRoutes.js";
import historyRoutes from "./src/routes/historyRoutes.js";
import liveRoutes from "./src/routes/liveRoutes.js";
import globalRoutes from "./src/routes/globalRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/scholars", scholarRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/live", liveRoutes);
app.use("/api/global", globalRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
