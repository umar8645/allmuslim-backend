// src/controllers/scholar.controller.js
import Scholar from "../models/Scholar.js";

export async function listScholars(req, res) {
  const { q, language, country } = req.query;
  const filter = {};
  if (language) filter.language = language;
  if (country) filter.country = country;
  if (q) filter.name = new RegExp(q, "i");

  const data = await Scholar.find(filter).sort({ qualityScore: -1 });
  res.json(data);
}