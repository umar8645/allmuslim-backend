import Video from "../models/Video.js";
import redis from "../config/redis.js";

export async function getVideos(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const cacheKey = `videos:${page}:${limit}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const videos = await Video.find()
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    if (!videos.length) {
      return res.status(503).json({
        error: "No videos available yet."
      });
    }

    await redis.set(cacheKey, JSON.stringify(videos), "EX", 60);

    res.json(videos);
  } catch (error) {
    console.error("Video Error:", error.message);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
}

export async function getVideoById(req, res) {
  try {
    const cacheKey = `video:${req.params.id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const video = await Video.findOne({ videoId: req.params.id }).lean();

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    await redis.set(cacheKey, JSON.stringify(video), "EX", 300);

    res.json(video);
  } catch (error) {
    console.error("Single Video Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
}