import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cron from "node-cron"

import connectDB from "./config/database.js"
import "./config/firebase.js"

import lectureRoutes from "./routes/lectures.js"

import { fetchYouTubeLectures } from "./crawlers/youtubeCrawler.js"
import { fetchRSSLectures } from "./crawlers/rssCrawler.js"

import { apiLimiter } from "./middleware/rateLimiter.js"
import { errorHandler } from "./middleware/errorMiddleware.js"

dotenv.config()

const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(apiLimiter)

// connect database
connectDB()

// home route
app.get("/", (req, res) => {
  res.json({
    name: "AllMuslim API",
    status: "running",
    endpoints: {
      lectures: "/api/lectures",
      trending: "/api/lectures/trending",
      search: "/api/lectures/search"
    }
  })
})

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

// routes
app.use("/api/lectures", lectureRoutes)

// error handler
app.use(errorHandler)

// start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("AllMuslim Backend running on port " + PORT)
})

// cron jobs
cron.schedule("0 * * * *", () => {
  fetchYouTubeLectures()
})

cron.schedule("30 * * * *", () => {
  fetchRSSLectures()
})