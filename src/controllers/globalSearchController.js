// controllers/globalSearchController.js
import Lecture from "../models/Lecture.js";

export const searchGlobalLectures = async (req, res) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const lectures = await Lecture.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCount = await Lecture.countDocuments({ $text: { $search: query } });

    res.json({ totalCount, page, results: lectures });
  } catch (error) {
    console.error("Global search error:", error.message);
    res.status(500).json({ message: "Error fetching global lectures" });
  }
};
