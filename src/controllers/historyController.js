import History from "../models/History.js";
// ✅ Save history
export const saveHistory = async (req, res) => {
  try {
    const { userId, lectureTitle, lectureUrl, type } = req.body;

    const history = await History.create({
      user: userId,
      lectureTitle,
      lectureUrl,
      type
    });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get user history
export const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await History.find({ user: userId })
      .populate("user", "name email")
      .sort({ date: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
