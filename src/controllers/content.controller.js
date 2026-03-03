// src/controllers/content.controller.js
import Content from "../models/Content.js";

export async function listContent(req, res) {
  const {
    q,
    language,
    country,
    source,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = {};
  if (language) filter.language = language;
  if (country) filter.country = country;
  if (source) filter.source = source;

  if (q) {
    filter.$text = { $search: q };
  }

  const data = await Content.find(filter)
    .sort({ publishedAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Content.countDocuments(filter);

  res.json({ total, page: Number(page), limit: Number(limit), data });
}

export async function getContent(req, res) {
  const item = await Content.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
}