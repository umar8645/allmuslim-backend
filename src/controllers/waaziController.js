import Content from "../models/Content.js";

export const getWaazi = async (req, res) => {
  const { category, country, speaker, q } = req.query;
  const filter = { type: "waazi" };

  if (country) filter.country = country;
  if (category) filter.category = category;
  if (speaker) filter.speaker = speaker;
  if (q) filter.title = new RegExp(q, "i");

  const data = await Content.find(filter)
    .populate("category", "name image")
    .populate("speaker", "name avatar")
    .sort({ dateTime: -1 })
    .limit(100);

  res.json(data);
};