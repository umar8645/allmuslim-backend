import Lecture from "../models/Lecture.js";
import LectureEngagement from "../models/LectureEngagement.js";

// ✅ Top lectures by views
export const getTopByViews = async (req, res) => {
  try {
    const lectures = await LectureEngagement.find()
      .sort({ views: -1 })
      .limit(10)
      .populate("lectureId");
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Top lectures by likes
export const getTopByLikes = async (req, res) => {
  try {
    const lectures = await LectureEngagement.find()
      .sort({ likes: -1 })
      .limit(10)
      .populate("lectureId");
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Top lectures by rating
export const getTopByRating = async (req, res) => {
  try {
    const lectures = await LectureEngagement.find()
      .sort({ rating: -1, ratingCount: -1 })
      .limit(10)
      .populate("lectureId");
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Top trending lectures (custom score)
export const getTopTrending = async (req, res) => {
  try {
    const lectures = await LectureEngagement.aggregate([
      {
        $project: {
          lectureId: 1,
          score: {
            $add: [
              { $multiply: ["$views", 0.5] },
              { $multiply: ["$likes", 2] },
              { $multiply: ["$shares", 1.5] },
              { $multiply: ["$rating", 3] }
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 10 }
    ]);

    const populated = await Lecture.populate(lectures, { path: "lectureId" });
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
