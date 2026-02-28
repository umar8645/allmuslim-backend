import Video from "../models/Video.js";

export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ publishedAt: -1 }).limit(50);
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};