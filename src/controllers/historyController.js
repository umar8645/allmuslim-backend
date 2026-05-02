import mongoose from "mongoose";
import History from "../models/History.js";

// ✅ Save history
export const saveHistory = async (req, res) => {
  try {
    const { userId, lectureTitle, lectureUrl, type } = req.body;
    const history = await History.create({ user: userId, lectureTitle, lectureUrl, type });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get user history with pagination + filtering
export const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, startDate, endDate, lastId, limit = 20 } = req.query;

    const query = { user: new mongoose.Types.ObjectId(userId) };

    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (lastId) query._id = { $lt: new mongoose.Types.ObjectId(lastId) };

    const history = await History.find(query)
      .populate("user", "name email")
      .sort({ _id: -1 })
      .limit(parseInt(limit));

    res.json({
      results: history,
      nextCursor: history.length > 0 ? history[history.length - 1]._id : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Full-text search in history
export const searchUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { query, lastId, limit = 20 } = req.query;

    const matchStage = { user: new mongoose.Types.ObjectId(userId) };
    if (lastId) matchStage._id = { $lt: new mongoose.Types.ObjectId(lastId) };

    const pipeline = [
      { $match: matchStage },
      ...(query ? [{ $match: { $text: { $search: query } } }] : []),
      { $sort: { _id: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          lectureTitle: 1,
          lectureUrl: 1,
          type: 1,
          date: 1,
          "user.name": 1,
          "user.email": 1,
          score: { $meta: "textScore" }
        }
      }
    ];

    const history = await History.aggregate(pipeline);

    res.json({
      results: history,
      nextCursor: history.length > 0 ? history[history.length - 1]._id : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
