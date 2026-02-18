import LibraryItem from "../models/LibraryItem.js";
import redis from "../config/redis.js";

export async function getLibrary(req, res) {
  try {
    const cacheKey = "library:latest";
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const items = await LibraryItem.find()
      .sort({ publishedAt: -1 })
      .limit(200)
      .lean();

    if (!items.length) {
      return res.status(503).json({
        error: "Library data not available yet."
      });
    }

    await redis.set(cacheKey, JSON.stringify(items), "EX", 120);

    res.json(items);
  } catch (error) {
    console.error("Library Error:", error.message);
    res.status(500).json({ error: "Failed to fetch library items" });
  }
}