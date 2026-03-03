// src/jobs/discovery.job.js
import Content from "../models/Content.js";
import { searchYouTube } from "../services/youtube.service.js";
import { detectLanguage } from "../services/language.service.js";
import { calculateQuality } from "../services/quality.service.js";

const KEYWORDS = ["waazi", "tafseer", "quran recitation"];

export async function discoveryJob() {
  for (const keyword of KEYWORDS) {
    const videos = await searchYouTube(keyword, 5);

    for (const v of videos) {
      const exists = await Content.findOne({ videoId: v.id.videoId });
      if (exists) continue;

      const lang = detectLanguage(v.snippet.title);
      const score = calculateQuality({
        title: v.snippet.title,
        description: v.snippet.description,
        publishedAt: v.snippet.publishedAt,
      });

      if (score < 60) continue;

      await Content.create({
        source: "youtube",
        videoId: v.id.videoId,
        title: v.snippet.title,
        description: v.snippet.description,
        speaker: v.snippet.channelTitle,
        channelId: v.snippet.channelId,
        thumbnail: v.snippet.thumbnails?.high?.url,
        language: lang,
        qualityScore: score,
        publishedAt: v.snippet.publishedAt,
      });
    }
  }
}