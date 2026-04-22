import express from "express";
import { getLectures, getTrending, searchLectures, getFeed } from "../controllers/lectureController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getLectures);
router.get("/trending", getTrending);
router.get("/search", searchLectures);
router.get("/feed", authMiddleware, getFeed);

export default router;
