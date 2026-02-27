import Content from "../models/Content.js";

export const getVideos = async (req, res) => {
  try {
    const videos = await Content.find({ type: "youtube" })
      .sort({ publishedAt: -1 })
      .limit(50);

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const video = await Content.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch video" });
  }
};