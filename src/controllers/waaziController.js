import Content from "../models/Content.js";

export const getAllWaazi = async (req, res) => {
  try {
    const waazi = await Content.find()
      .sort({ dateTime: -1 })
      .limit(200);
    res.json(waazi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUpcomingWaazi = async (req, res) => {
  try {
    const now = new Date();
    const waazi = await Content.find({ dateTime: { $gte: now } })
      .sort({ dateTime: 1 })
      .limit(200);
    res.json(waazi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};