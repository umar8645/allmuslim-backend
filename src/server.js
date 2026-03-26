import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import cron from "node-cron"

import connectDB from "./config/database.js"

import lectureRoutes from "./routes/lectures.js"
import authRoutes from "./routes/auth.js"
import aiRoutes from "./routes/ai.js"

import { fetchYouTubeLectures } from "./crawlers/youtubeCrawler.js"
import { fetchRSSLectures } from "./crawlers/rssCrawler.js"

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.get("/", (req, res) => {
  res.json({ status: "OK" })
})

app.use("/api/auth", authRoutes)
app.use("/api/lectures", lectureRoutes)
app.use("/api/ai", aiRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("🚀 Server running on " + PORT)
})

cron.schedule("0 */3 * * *", fetchYouTubeLectures)
cron.schedule("30 */3 * * *", fetchRSSLectures)