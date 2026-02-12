import RSSFeed from "../models/RSSFeed.js";

export async function getRSSFeeds(req, res) {
  try {
    const feeds = await RSSFeed.find()
      .sort({ dateTime: -1 })
      .limit(100)
      .lean();

    res.json(feeds);
  } catch {
    res.status(500).json({ error: "Failed to fetch RSS feeds" });
  }
}
