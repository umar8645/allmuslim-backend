import axios from "axios";
import Content from "../models/Content.js";

export const fetchExternalWaazi = async () => {
  if (!process.env.WAAZI_API_URL) return;

  try {
    const res = await axios.get(process.env.WAAZI_API_URL);

    for (const item of res.data || []) {
      await Content.updateOne(
        { sourceUrl: item.url },
        {
          title: item.title,
          speaker: item.speaker,
          dateTime: new Date(item.dateTime),
          sourceUrl: item.url,
          sourceType: "waazi",
          mediaThumbnail: item.thumbnail
        },
        { upsert: true }
      );
    }

    console.log("✅ Waazi updated");

  } catch (err) {
    console.error("❌ Waazi error:", err.message);
  }
};