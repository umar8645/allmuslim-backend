const express = require("express");
const router = express.Router();
const Content = require("../models/Content");

// 🔥 UPCOMING WAAZI (FROM contents)
router.get("/upcoming", async (req, res) => {
  try {
    const now = new Date();

    const waazi = await Content.find({
      dateTime: { $gte: now }
    })
      .sort({ dateTime: 1 })
      .limit(50);

    if (!waazi.length) {
      return res.status(200).json([]);
    }

    res.json(
      waazi.map(item => ({
        _id: item._id,
        title: item.title,
        speaker: item.speaker,
        dateTime: item.dateTime,
        location: item.location ?? "Unknown location"
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load waazi" });
  }
});

module.exports = router;