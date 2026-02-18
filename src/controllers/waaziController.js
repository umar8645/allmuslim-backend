import Waazi from "../models/Waazi.js";
import redis from "../config/redis.js";

export async function getUpcomingWaazi(req, res) {
  try {
    const cacheKey = "waazi:upcoming";
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const now = new Date();

    const waazi = await Waazi.find({
      dateTime: { $gte: now }
    })
      .sort({ dateTime: 1 })
      .lean();

    if (!waazi.length) {
      return res.status(503).json({
        error: "No upcoming waazi found."
      });
    }

    await redis.set(cacheKey, JSON.stringify(waazi), "EX", 120);

    res.json(waazi);

  } catch (error) {
    console.error("Upcoming Waazi Error:", error.message);
    res.status(500).json({ error: "Failed to fetch waazi" });
  }
}

export async function getPastWaazi(req, res) {
  try {
    const cacheKey = "waazi:past";
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const now = new Date();

    const waazi = await Waazi.find({
      dateTime: { $lt: now }
    })
      .sort({ dateTime: -1 })
      .lean();

    if (!waazi.length) {
      return res.status(503).json({
        error: "No past waazi found."
      });
    }

    await redis.set(cacheKey, JSON.stringify(waazi), "EX", 120);

    res.json(waazi);

  } catch (error) {
    console.error("Past Waazi Error:", error.message);
    res.status(500).json({ error: "Failed to fetch waazi" });
  }
}