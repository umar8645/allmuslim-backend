import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import cron from "node-cron"

import connectDB from "./config/database.js"

import lectureRoutes from "./routes/lectures.js"
import authRoutes from "./routes/auth.js"
import aiRoutes from "./routes/ai.js"
import globalSearchRoutes from "./routes/globalSearch.js"
import liveRoutes from "./routes/live.js"
import downloadRoutes from "./routes/download.js"

import { fetchYouTubeLectures } from "./crawlers/youtubeCrawler.js"
import { fetchRSSLectures } from "./crawlers/rssCrawler.js"

import { apiLimiter } from "./middleware/rateLimiter.js"
import { errorHandler } from "./middleware/errorMiddleware.js"

const app = express()

// check required env variables
const requiredEnv = [
  "OPENAI_API_KEY",
  "YOUTUBE_API_KEYS",
  "MONGO_URI",
  "JWT_SECRET"
]

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`${key} missing in .env`)
    process.exit(1)
  }
}

app.set("trust proxy", 1)

app.use(cors())
app.use(express.json())
app.use(apiLimiter)

// connect database
connectDB()

// routes
app.get("/", (req, res) => {
  res.json({
    name: "AllMuslim API",
    status: "running"
  })
})

app.use("/api/auth", authRoutes)
app.use("/api/lectures", lectureRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/search", globalSearchRoutes)   // ✅ gyara route
app.use("/api/live", liveRoutes)
app.use("/api/download", downloadRoutes)

app.use(errorHandler)

// start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("AllMuslim Backend running on port " + PORT)
})

// cron jobs
cron.schedule("0 * * * *", async () => {
  await fetchYouTubeLectures()
})

cron.schedule("30 * * * *", async () => {
  await fetchRSSLectures()
})
