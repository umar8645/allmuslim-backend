// src/services/youtubeService.js

import axios from "axios";
import RSSFeed from "../models/RSSFeed.js";
import { getApiKey, rotateKey } from "../utils/youtubeKeys.js";

export const updateYouTube = async () => {
  const channels =
    process.env.YOUTUBE_CHANNELS?.split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0) || [];

  if (!channels.length) {
    console.warn("⚠️ No YOUTUBE_CHANNELS configured");
    return;
  }

  for (const channelId of channels) {
    try {
      const apiKey = getApiKey();

      if (!apiKey) {
        console.error("❌ Cannot fetch YouTube data — No API key");
        return;
      }

      const res = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            key: apiKey,
            channelId,
            part: "snippet",
            order: "date",
            maxResults: 5
          },
          timeout: 10000
        }
      );

      if (!res.data?.items) {
        console.warn("⚠️ No YouTube items returned");
        continue;
      }

      for (const item of res.data.items) {
        if (!item.id?.videoId) continue;

        const videoUrl = `https://youtube.com/watch?v=${item.id.videoId}`;

        await RSSFeed.updateOne(
          { sourceUrl: videoUrl },
          {
            title: item.snippet.title,
            speaker: item.snippet.channelTitle,
            dateTime: new Date(item.snippet.publishedAt),
            sourceUrl: videoUrl,
            sourceType: "youtube",
            mediaThumbnail: item.snippet.thumbnails?.high?.url || null
          },
          { upsert: true }
        );
      }

      console.log("✅ YouTube updated:", channelId);
    } catch (err) {
      console.error(
        `❌ YouTube error for ${channelId}:`,
        err.response?.data || err.message
      );

      // Rotate API key on quota or failure
      rotateKey();
    }
  }
};