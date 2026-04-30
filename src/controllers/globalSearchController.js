import Lecture from "../models/Lecture.js";

export const searchGlobalLectures = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    // Yin search ta MongoDB text index
    const lectures = await Lecture.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } } // don ranking
    )
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .limit(50);

    res.json({ count: lectures.length, results: lectures });
  } catch (error) {
    console.error("Global search error:", error.message);
    res.status(500).json({ message: "Error fetching global lectures" });
  }
};
