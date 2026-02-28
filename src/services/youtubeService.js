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

  const key = apiKeys[keyIndex];

  keyIndex = (keyIndex + 1) % apiKeys.length;

  return key;

};

export const fetchLatestVideos = async () => {

  try {

    if (apiKeys.length === 0 || channels.length === 0) {

      console.log("YouTube config missing");
      return;

    }

    for (const channelId of channels) {

      try {

        const apiKey = getApiKey();

        const url =
          `https://www.googleapis.com/youtube/v3/search` +
          `?part=snippet` +
          `&channelId=${channelId}` +
          `&maxResults=5` +
          `&order=date` +
          `&type=video` +
          `&key=${apiKey}`;

        const res = await axios.get(url);

        const items = res.data.items || [];

        for (const item of items) {

          const videoId = item.id.videoId;

          if (!videoId) continue;

          await Video.findOneAndUpdate(

            { videoId },

            {
              title: item.snippet.title,
              videoId,

              speaker: item.snippet.channelTitle,

              publishedAt:
                new Date(item.snippet.publishedAt),

              thumbnailUrl:
                item.snippet.thumbnails.high.url,

              source: "youtube"

            },

            { upsert: true }

          );

        }

        console.log("YouTube saved:", channelId);

      } catch (err) {

        console.error("YouTube error:", err.message);

      }

    }

  } catch (error) {

    console.error("YouTube service error:", error.message);

  }

};