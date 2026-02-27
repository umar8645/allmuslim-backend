import Content from "../models/Content.js";

export async function getVideos(req, res) {
  try {
    const videos = await Content.find({ type: "youtube" })
      .sort({ publishedAt: -1 })
      .limit(100);

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
}