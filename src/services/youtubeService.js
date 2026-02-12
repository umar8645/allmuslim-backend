import axios from "axios";
import Video from "../models/Video.js";

const apiKeys = process.env.YOUTUBE_API_KEYS
  ? process.env.YOUTUBE_API_KEYS.split(",")
  : [];

const channels = process.env.YOUTUBE_CHANNELS
  ? process.env.YOUTUBE_CHANNELS.split(",")
  : [];

let keyIndex = 0;

const getApiKey = () => {
  if (apiKeys.length === 0) return null;
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
      const apiKey = getApiKey();

      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=5&order=date&type=video&key=${apiKey}`;

      const response = await axios.get(url);
      const videos = response.data.items;

      for (const video of videos) {
        await Video.updateOne(
          { videoId: video.id.videoId },
          {
            title: video.snippet.title,
            videoId: video.id.videoId,
            speaker: video.snippet.channelTitle,
            publishedAt: video.snippet.publishedAt,
            thumbnailUrl: video.snippet.thumbnails.high.url,
            source: "youtube"
          },
          { upsert: true }
        );
      }

      console.log(`✅ YouTube saved for ${channelId}`);
    }
  } catch (error) {
    console.error("YouTube service error:", error.message);
  }
};