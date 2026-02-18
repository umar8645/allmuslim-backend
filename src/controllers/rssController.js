import RSSFeed from "../models/RSSFeed.js";
import redis from "../config/redis.js";

export async function getRSSFeeds(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // 1️⃣ Check Redis Cache
    const cached = await redis.get("latest_news");

    if (cached) {
      const parsed = JSON.parse(cached);
      return res.status(200).json(parsed);
    }

    // 2️⃣ Fallback to MongoDB
    const feeds = await RSSFeed.find()
      .sort({ dateTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    if (!feeds.length) {
      return res.status(503).json({
        error: "No RSS data available yet. Scheduler may not have fetched data."
      });
    }

    // 3️⃣ Save to Redis for next request
    await redis.set(
      "latest_news",
      JSON.stringify(feeds),
      "EX",
      60
    );

    return res.status(200).json(feeds);

  } catch (error) {
    console.error("RSS Controller Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch RSS feeds" });
  }
}