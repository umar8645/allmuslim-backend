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

const getApiKey = () => {
  if (apiKeys.length === 0) return null;
  const key = apiKeys[keyIndex];
  keyIndex = (keyIndex + 1) % apiKeys.length;
  return key;
};

export const fetchLatestVideos = async () => {
  if (apiKeys.length === 0 || channels.length === 0) {
    console.log("⚠️ YouTube config missing");
    return;
  }

  for (const channelId of channels) {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.log("⚠️ No YouTube API key available");
      return;
    }

    const url =
      "https://www.googleapis.com/youtube/v3/search" +
      `?part=snippet` +
      `&channelId=${channelId}` +
      `&maxResults=5` +
      `&order=date` +
      `&type=video` +
      `&key=${apiKey}`;

    try {
      const res = await axios.get(url, { timeout: 15000 });
      const items = res.data?.items || [];

      if (items.length === 0) {
        console.log("⚠️ No videos for channel:", channelId);
        continue;
      }

      for (const item of items) {
        const videoId = item?.id?.videoId;
        if (!videoId) continue;

        await Video.updateOne(
          { videoId },
          {
            title: item.snippet?.title || "Untitled",
            videoId,
            speaker: item.snippet?.channelTitle || "Unknown",
            publishedAt: new Date(item.snippet?.publishedAt),
            thumbnailUrl: item.snippet?.thumbnails?.high?.url,
            source: "youtube"
          },
          { upsert: true }
        );
      }

      console.log("✅ YouTube saved:", channelId);

    } catch (err) {
      // 400 / 403 / quota / invalid channel → SKIP ONLY
      console.log("⚠️ YouTube skipped:", channelId);
    }
  }
};