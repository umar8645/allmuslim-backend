// src/services/dedup.service.js
import Content from "../models/Content.js";

export async function isDuplicate({ videoId, title, channelId }) {
  if (videoId) {
    const byId = await Content.findOne({ videoId });
    if (byId) return true;
  }

  const byTitle = await Content.findOne({
    title: new RegExp(title.slice(0, 30), "i"),
    channelId,
  });

  return !!byTitle;
}