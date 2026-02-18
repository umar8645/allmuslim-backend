import Notification from "../models/Notification.js";
import redis from "../config/redis.js";

export async function getNotifications(req, res) {
  try {
    const cacheKey = "notifications:latest";
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const notes = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    if (!notes.length) {
      return res.status(503).json({
        error: "No notifications available yet."
      });
    }

    await redis.set(cacheKey, JSON.stringify(notes), "EX", 60);

    res.json(notes);
  } catch (error) {
    console.error("Notification Error:", error.message);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}