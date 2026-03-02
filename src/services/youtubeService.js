import axios from "axios";
import Video from "../models/Video.js";

const apiKeys = (process.env.YOUTUBE_API_KEYS || "")
  .split(",")
  .map(k => k.trim())
  .filter(Boolean);

const channels = (process.env.YOUTUBE_CHANNELS || "")
  .split(",")
  .map(c => c.trim())
  .filter(Boolean);

let keyIndex = 0;
const getApiKey = () => apiKeys[keyIndex];

const rotateKey = () => {
  keyIndex = (keyIndex + 1) % apiKeys.length;
  console.warn("🔄 Switched to next YouTube API key");
};

export const fetchLatestVideos = async () => {
  if (!apiKeys.length || !channels.length) {
    console.log("⚠️ YouTube config missing");
    return [];
  }

  const newVideos = [];

  for (const channelId of channels) {
    let attempts = 0;

    while (attempts < apiKeys.length) {
      const apiKey = getApiKey();

      try {
        const res = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              channelId,
              maxResults: 5,
              order: "date",
              type: "video",
              key: apiKey
            },
            timeout: 15000
          }
        );

        for (const item of res.data.items || []) {
          if (!item.id?.videoId) continue;

          const result = await Video.updateOne(
            { videoId: item.id.videoId },
            {
              title: item.snippet.title,
              speaker: item.snippet.channelTitle,
              publishedAt: new Date(item.snippet.publishedAt),
              thumbnailUrl: item.snippet.thumbnails?.high?.url,
              source: "youtube"
            },
            { upsert: true }
          );

          if (result.upserted) {
            newVideos.push({
              title: item.snippet.title,
              videoId: item.id.videoId,
              speaker: item.snippet.channelTitle
            });
          }
        }

        console.log("✅ YouTube saved:", channelId);
        break; // 🟢 nasara → fita daga while
      } catch (err) {
        const status = err.response?.status;
        if ([400, 403, 429].includes(status)) {
          rotateKey();
          attempts++;
          continue;
        }
        console.log("⚠️ YouTube error:", err.message);
        break;
      }
    }
  }

  return newVideos; // ✅ dawo da sabon videos don notifications
};