// controllers/lectureController.js
import Lecture from "../models/Lecture.js";
import { getTrendingLectures } from "../services/rssCrawler.js";

export const getLectures = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const totalCount = await Lecture.countDocuments();

    const lectures = await Lecture.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ totalCount, page, results: lectures });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrending = async (req, res) => {
  try {
    const lectures = await getTrendingLectures();
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchLectures = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    if (!q) return res.json([]);

    const lectures = await Lecture.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCount = await Lecture.countDocuments({ $text: { $search: q } });

    res.json({ totalCount, page, results: lectures });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Feed endpoint (random lectures)
export const getFeed = async (req, res) => {
  try {
    const lectures = await Lecture.aggregate([{ $sample: { size: 20 } }]);
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
