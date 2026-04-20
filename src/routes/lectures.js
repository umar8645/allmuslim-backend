import express from "express"
import { getLectures, getTrending, searchLectures, getFeed } from "../controllers/lectureController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.get("/", getLectures)
router.get("/trending", getTrending)
router.get("/search", searchLectures)

// Protected route (requires JWT)
router.get("/feed", authMiddleware, getFeed)

export default router
