import axios from "axios";

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

        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=5&order=date&type=video&key=${apiKey}`;

        const response = await axios.get(url);

        console.log(`YouTube videos fetched for channel ${channelId}`);
      } catch (err) {
        console.error("YouTube fetch error:", err.message);
      }
    }
  } catch (error) {
    console.error("YouTube service error:", error.message);
  }
};
