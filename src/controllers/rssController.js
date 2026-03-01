import RSSFeed from "../models/RSSFeed.js";

export const getRSSFeeds = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 50);

    const feeds = await RSSFeed.find()
      .sort({ dateTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await RSSFeed.countDocuments();

    res.json({ total, page, limit, data: feeds });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch RSS feeds" });
  }
};