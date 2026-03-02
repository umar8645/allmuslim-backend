export const getVideos = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);

  const videos = await Video.find()
    .sort({ publishedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Video.countDocuments();
  res.json({ total, page, limit, data: videos });
};