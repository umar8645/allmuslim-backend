import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cron from "node-cron"

import connectDB from "./config/database.js"

import lectureRoutes from "./routes/lectures.js"
import authRoutes from "./routes/auth.js"
import aiRoutes from "./routes/ai.js"

import { fetchYouTubeLectures } from "./crawlers/youtubeCrawler.js"
import { fetchRSSLectures } from "./crawlers/rssCrawler.js"

import { apiLimiter } from "./middleware/rateLimiter.js"
import { errorHandler } from "./middleware/errorMiddleware.js"

dotenv.config()

const app = express()

app.set("trust proxy", 1)

app.use(cors())

app.use(express.json())

app.use(apiLimiter)

connectDB()

app.get("/", (req, res) => {

res.json({
name: "AllMuslim API",
status: "running"
})

})

app.use("/api/auth", authRoutes)
app.use("/api/lectures", lectureRoutes)
app.use("/api/ai", aiRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {

console.log("🚀 AllMuslim Backend running on port " + PORT)

})

cron.schedule("0 * * * *", fetchYouTubeLectures)

cron.schedule("30 * * * *", fetchRSSLectures)
