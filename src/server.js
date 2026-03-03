import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { startScheduler } from "./schedulers/main.scheduler.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

app.get("/", (req, res) => {
  res.send("API Running...");
});

// START SCHEDULER ONLY IN PRODUCTION
if (process.env.NODE_ENV === "production") {
  startScheduler();
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});