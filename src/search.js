// src/routes/search.js
import express from "express";
import youtubeSearch from "youtube-search";

const router = express.Router();

const keys = process.env.YOUTUBE_API_KEYS.split(",");
const getKey = () => keys[Math.floor(Math.random() * keys.length)];

router.get("/", async (req, res) => {
  try {
    const q = req.query.q || "Islamic lecture";

    const results = await youtubeSearch(q, {
      maxResults: 20,
      key: getKey()
    });

    const data = results.results.map(v => ({
      title: v.title,
      channel: v.channelTitle,
      url: v.link,
      thumbnail: v.thumbnails.default.url,
      live: v.liveBroadcastContent === "live"
    }));

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;