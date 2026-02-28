import axios from "axios";
import Content from "../models/Content.js";

const apiKeys = process.env.YOUTUBE_API_KEYS
  ? process.env.YOUTUBE_API_KEYS.split(",")
  : [];

const channels = process.env.YOUTUBE_CHANNELS
  ? process.env.YOUTUBE_CHANNELS.split(",")
  : [];

let keyIndex = 0;

const getApiKey = () => {
  const key = apiKeys[keyIndex];
  keyIndex = (keyIndex + 1) % apiKeys.length;
  return key;
};

export const fetchLatestVideos = async () => {
  try {
    if (apiKeys.length === 0 || channels.length === 0) {
      console.log("YouTube keys or channels missing");
      return;
    }

    for (const channelId of channels) {
      try {
        const apiKey = getApiKey();

        const url =
          `https://www.googleapis.com/youtube/v3/search` +
          `?part=snippet&channelId=${channelId}` +
          `&maxResults=5&order=date&type=video&key=${apiKey}`;

        const response = await axios.get(url);

        const items = response.data.items || [];

        for (const item of items) {
          const videoId = item.id?.videoId;
          if (!videoId) continue;

          const videoUrl = `https://youtube.com/watch?v=${videoId}`;

          await Content.findOneAndUpdate(
            { url: videoUrl },
            {
              title: item.snippet.title,
              description: item.snippet.description,
              url: videoUrl,
              thumbnail: item.snippet.thumbnails?.high?.url,
              source: "youtube",
              type: "youtube",
              publishedAt: new Date(item.snippet.publishedAt),
            },
            { upsert: true, new: true }
          );
        }

        console.log(`YouTube videos saved for channel ${channelId}`);
      } catch (err) {
        console.error(
          `YouTube fetch error (${channelId}):`,
          err.response?.data?.error?.message || err.message
        );
      }
    }
  } catch (error) {
    console.error("YouTube service error:", error.message);
  }
};