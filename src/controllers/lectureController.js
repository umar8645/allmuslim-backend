import Lecture from "../models/Lecture.js"
import { getTrendingLectures } from "../services/trendingService.js"


// GET ALL LECTURES
export const getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find().sort({ createdAt: -1 })
    res.json(lectures)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// GET TRENDING LECTURES
export const getTrending = async (req, res) => {
  try {
    const lectures = await getTrendingLectures()
    res.json(lectures)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// SEARCH LECTURES
export const searchLectures = async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.json([])
    }

    const lectures = await Lecture.find({
      title: { $regex: q, $options: "i" }
    }).sort({ createdAt: -1 })

    res.json(lectures)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}