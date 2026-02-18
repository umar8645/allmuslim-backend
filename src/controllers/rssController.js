import RSSFeed from "../models/RSSFeed.js";
import redis from "../config/redis.js";

export async function getRSSFeeds(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const cacheKey = `latest_news_${page}_${limit}`;

    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const feeds = await RSSFeed.find()
      .sort({ dateTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    await redis.set(cacheKey, JSON.stringify(feeds), "EX", 60);

    res.json(feeds);
  } catch (error) {
    console.error("RSS Controller Error:", error.message);
    res.status(500).json({ error: "Failed to fetch RSS feeds" });
  }
}