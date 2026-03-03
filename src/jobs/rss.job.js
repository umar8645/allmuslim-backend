// src/jobs/rss.job.js
import Content from "../models/Content.js";
import { fetchRSS } from "../services/rss.service.js";
import { detectLanguage } from "../services/language.service.js";
import { calculateQuality } from "../services/quality.service.js";

const RSS_FEEDS = [
  "https://dawahnigeria.com/feed",
  "https://islaminnigeria.com/feed",
];

export async function rssJob() {
  for (const url of RSS_FEEDS) {
    const items = await fetchRSS(url);

    for (const item of items) {
      const exists = await Content.findOne({ title: item.title });
      if (exists) continue;

      const lang = detectLanguage(item.title + item.contentSnippet);
      const score = calculateQuality({
        title: item.title,
        description: item.contentSnippet,
        publishedAt: item.pubDate,
      });

      if (score < 60) continue;

      await Content.create({
        source: "rss",
        title: item.title,
        description: item.contentSnippet,
        speaker: item.creator || "Unknown",
        language: lang,
        qualityScore: score,
        publishedAt: item.pubDate,
      });
    }
  }
}