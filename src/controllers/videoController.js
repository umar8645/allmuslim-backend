import Video from "../models/Video.js";
import redis from "../config/redis.js";

export async function getVideos(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const cacheKey = `videos:${page}:${limit}`;
    const cached = await redis.get(cacheKey);

    if (cached) return res.json(JSON.parse(cached));

    const videos = await Video.find()
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    await redis.set(cacheKey, JSON.stringify(videos), "EX", 60);

    res.json(videos);
  } catch {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
}

export async function getVideoById(req, res) {
  try {
    const video = await Video.findOne({ videoId: req.params.id }).lean();
    if (!video) return res.status(404).json({ error: "Not found" });
    res.json(video);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
}