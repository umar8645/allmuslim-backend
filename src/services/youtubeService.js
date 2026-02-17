import axios from "axios";
import Video from "../models/Video.js";

const apiKeys = process.env.YOUTUBE_API_KEYS.split(",");
const channels = process.env.YOUTUBE_CHANNELS.split(",");

let index = 0;
const getKey = () => apiKeys[index++ % apiKeys.length];

export const fetchLatestVideos = async () => {
  for (const channelId of channels) {
    const apiKey = getKey();

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=5&order=date&type=video&key=${apiKey}`;

    const response = await axios.get(url);

    for (const v of response.data.items) {
      await Video.updateOne(
        { videoId: v.id.videoId },
        {
          title: v.snippet.title,
          videoId: v.id.videoId,
          speaker: v.snippet.channelTitle,
          publishedAt: v.snippet.publishedAt,
          thumbnailUrl: v.snippet.thumbnails.high.url
        },
        { upsert: true }
      );
    }
  }

  console.log("✅ YouTube updated");
};