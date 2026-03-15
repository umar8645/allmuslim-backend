import Lecture from "../models/Lecture.js"
import { getTrendingLectures } from "../services/trendingService.js"

export const getLectures = async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1
    const limit = 20

    const lectures = await Lecture.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    res.json(lectures)

  } catch (error) {

    res.status(500).json({ message: error.message })

  }

}

export const getTrending = async (req, res) => {

  try {

    const lectures = await getTrendingLectures()
    res.json(lectures)

  } catch (error) {

    res.status(500).json({ message: error.message })

  }

}

export const searchLectures = async (req, res) => {

  try {

    const { q } = req.query

    if (!q) return res.json([])

    const lectures = await Lecture.find({
      $text: { $search: q }
    }).sort({ createdAt: -1 })

    res.json(lectures)

  } catch (error) {

    res.status(500).json({ message: error.message })

  }

}

export const getFeed = async (req, res) => {

  try {

    const lectures = await Lecture.aggregate([
      { $sample: { size: 20 } }
    ])

    res.json(lectures)

  } catch (error) {

    res.status(500).json({ message: error.message })

  }

}