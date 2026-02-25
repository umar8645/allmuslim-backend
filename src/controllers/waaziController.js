// src/controllers/waaziController.js
import Content from "../models/Content.js";

// GET /api/waazi
export const getAllWaazi = async (req, res) => {
  try {
    const waazi = await Content.find({
      sourceType: "youtube",
    }).sort({ dateTime: -1 });

    res.json(waazi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/waazi/upcoming
export const getUpcomingWaazi = async (req, res) => {
  try {
    const now = new Date();

    const waazi = await Content.find({
      sourceType: "youtube",
      dateTime: { $gte: now },
    }).sort({ dateTime: 1 });

    if (!waazi.length) {
      return res
        .status(404)
        .json({ error: "No upcoming waazi found." });
    }

    res.json(waazi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};