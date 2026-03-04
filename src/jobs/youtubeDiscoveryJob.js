import Content from "../models/Content.js";
import { searchYouTube } from "../services/youtubeSearchService.js";
import { addToPlaylist } from "../services/youtubePlaylistService.js";
import { isAllowedLanguage } from "../utils/languageFilter.js";
import { calculateQualityScore } from "../utils/qualityScore.js";

// ✅ Gyara nan: kare idan env bai wanzu ba
const keywords = (process.env.YOUTUBE_SEARCH_KEYWORDS || "")
  .split(",")
  .map(k => k.trim())
  .filter(k => k.length > 0);

const MAX = Number(process.env.YOUTUBE_MAX_RESULTS || 5);
const MIN_SCORE = Number(process.env.MIN_QUALITY_SCORE || 70);
const MAX_AGE = Number(process.env.MAX_VIDEO_AGE_DAYS || 60);

export async function runYouTubeDiscovery() {
  if (keywords.length === 0) {
    console.warn("⚠️ No YOUTUBE_SEARCH_KEYWORDS provided, skipping discovery");
    return;
  }

  for (const keyword of keywords) {
    const results = await searchYouTube({ q: keyword, maxResults: MAX });

    for (const item of results) {
      const v = item.snippet;
      const videoId = item.id?.videoId;
      if (!videoId) continue;

      if (!isAllowedLanguage(v.title + " " + v.description)) continue;

      const ageDays = (Date.now() - new Date(v.publishedAt)) / 86400000;
      if (ageDays > MAX_AGE) continue;

      if ((v.description || "").length < Number(process.env.MIN_DESCRIPTION_LENGTH || 20)) continue;

      const score = calculateQualityScore({
        title: v.title,
        description: v.description,
        thumbnail: v.thumbnails?.high?.url,
        publishedAt: v.publishedAt,
        channelTitle: v.channelTitle
      });

      if (score < MIN_SCORE) continue;

      const saved = await Content.updateOne(
        { sourceId: videoId },
        {
          title: v.title,
          description: v.description,
          thumbnail: v.thumbnails?.high?.url,
          source: "youtube",
          type: "waazi",
          dateTime: new Date(v.publishedAt),
          qualityScore: score
        },
        { upsert: true }
      );

      if (saved.upserted && process.env.MASTER_PLAYLIST_ID) {
        await addToPlaylist(process.env.MASTER_PLAYLIST_ID, videoId);
      }
    }
  }
}
