import axios from "axios";
import RSSFeed from "../models/RSSFeed.js";
import { getApiKey, rotateKey } from "../utils/youtubeKeys.js";

export const updateYouTube = async () => {
  const channels = process.env.YOUTUBE_CHANNELS?.split(",") || [];

  for (const channelId of channels) {
    try {
      const res = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            key: getApiKey(),
            channelId,
            part: "snippet",
            order: "date",
            maxResults: 5
          }
        }
      );

      for (const item of res.data.items) {
        if (!item.id.videoId) continue;

        await RSSFeed.updateOne(
          { sourceUrl: `https://youtube.com/watch?v=${item.id.videoId}` },
          {
            title: item.snippet.title,
            speaker: item.snippet.channelTitle,
            dateTime: new Date(item.snippet.publishedAt),
            sourceUrl: `https://youtube.com/watch?v=${item.id.videoId}`,
            sourceType: "youtube",
            mediaThumbnail: item.snippet.thumbnails.high.url
          },
          { upsert: true }
        );
      }

      console.log("✅ YouTube updated:", channelId);
    } catch (err) {
      rotateKey();
      console.error("❌ YouTube error:", channelId);
    }
  }
};