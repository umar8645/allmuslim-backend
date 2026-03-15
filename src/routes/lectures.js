import express from "express"
import { getLectures, getTrending, searchLectures, getFeed } from "../controllers/lectureController.js"

const router = express.Router()

router.get("/", getLectures)
router.get("/trending", getTrending)
router.get("/search", searchLectures)
router.get("/feed", getFeed)

export default router