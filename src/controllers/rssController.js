import RSSFeed from "../models/RSSFeed.js";

export async function getRSSFeeds(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const feeds = await RSSFeed.find()
      .sort({ dateTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json(feeds);
  } catch {
    res.status(500).json({ error: "Failed to fetch RSS feeds" });
  }
}