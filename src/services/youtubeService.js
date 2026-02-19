import axios from "axios";
import Content from "../models/Content.js";
import { getApiKey, rotateKey } from "../utils/youtubeKeys.js";

export const updateYouTube = async () => {
  if (!process.env.YOUTUBE_CHANNELS) return;

  const channels = process.env.YOUTUBE_CHANNELS.split(",");

  for (const channelId of channels) {
    try {
      const apiKey = getApiKey();
      if (!apiKey) return;

      const res = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            key: apiKey,
            channelId,
            part: "snippet",
            order: "date",
            maxResults: 10
          }
        }
      );

      for (const item of res.data.items || []) {
        if (!item.id?.videoId) continue;

        const videoUrl = `https://youtube.com/watch?v=${item.id.videoId}`;

        await Content.updateOne(
          { sourceUrl: videoUrl },
          {
            title: item.snippet.title,
            speaker: item.snippet.channelTitle,
            dateTime: new Date(item.snippet.publishedAt),
            sourceUrl: videoUrl,
            sourceType: "youtube",
            mediaThumbnail: item.snippet.thumbnails?.high?.url
          },
          { upsert: true }
        );
      }

      console.log("✅ YouTube updated:", channelId);

    } catch (err) {
      console.error("❌ YouTube error:", err.message);
      rotateKey();
    }
  }
};