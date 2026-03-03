// src/controllers/feed.controller.js
import Content from "../models/Content.js";
import Scholar from "../models/Scholar.js";
import UserPreference from "../models/UserPreference.js";
import { personalizeScore } from "../services/personalization.service.js";

export async function getPersonalizedFeed(req, res) {
  const user = await UserPreference.findOne({ userId: req.user.id });
  if (!user) return res.json([]);

  const contents = await Content.find({
    language: { $in: user.languages },
    country: { $in: user.countries },
  }).limit(100);

  const ranked = [];

  for (const c of contents) {
    const scholar = await Scholar.findOne({ channelId: c.channelId });
    if (!scholar) continue;

    const score = personalizeScore({ content: c, scholar, user });
    ranked.push({ ...c.toObject(), score });
  }

  ranked.sort((a, b) => b.score - a.score);
  res.json(ranked.slice(0, 30));
}