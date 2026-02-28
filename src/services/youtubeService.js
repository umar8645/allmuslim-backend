import Video from "../models/Video.js";
import fetch from "node-fetch";

export const fetchYouTubeVideos = async (channelId, apiKey) => {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&type=video&maxResults=5`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items) return;

  for (const item of data.items) {
    await Video.updateOne(
      { videoId: item.id.videoId },
      {
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      },
      { upsert: true }
    );
  }
};