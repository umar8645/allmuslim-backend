import express from "express"
import { getLectures, getTrending, searchLectures } from "../controllers/lectureController.js"

const router = express.Router()

router.get("/", getLectures)
router.get("/trending", getTrending)
router.get("/search", searchLectures)

export default router