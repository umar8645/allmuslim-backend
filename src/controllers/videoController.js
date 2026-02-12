import Video from "../models/Video.js";

export async function getVideos(req, res) {

  const page = parseInt(req.query.page) || 1;
  const limit = 20;

  const videos = await Video.find()
    .sort({ publishedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json(videos);
}

export async function getVideoById(req, res) {

  const video = await Video.findOne({ videoId: req.params.id });

  if (!video) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(video);
}
