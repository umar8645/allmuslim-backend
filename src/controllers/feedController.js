import Content from "../models/Content.js";
import redis from "../config/redis.js";

export async function getFeed(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const cacheKey = `feed:${page}:${limit}`;

    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const feed = await Content.find()
      .sort({ dateTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    await redis.set(cacheKey, JSON.stringify(feed), "EX", 60);

    res.json(feed);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}