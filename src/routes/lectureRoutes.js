// routes/lectureRoutes.js
import express from "express";
import { getLectures, getTrending, searchLectures, getFeed } from "../controllers/lectureController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all lectures with pagination
router.get("/", getLectures);

// ✅ Get trending lectures
router.get("/trending", getTrending);

// ✅ Search lectures
router.get("/search", searchLectures);

// ✅ Personalized feed (requires auth)
router.get("/feed", authMiddleware, getFeed);

export default router;
