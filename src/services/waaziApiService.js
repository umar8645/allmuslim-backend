import axios from "axios";
import Content from "../models/Content.js";

export const fetchExternalWaazi = async () => {
  const url = process.env.WAAZI_API_URL;

  if (!url || !url.startsWith("http")) {
    console.log("⚠️ Invalid WAAZI_API_URL");
    return;
  }

  const res = await axios.get(url);

  for (const item of res.data || []) {
    await Content.updateOne(
      { url: item.url },
      {
        title: item.title,
        source: "external",
        type: "waazi",
        dateTime: new Date(item.date)
      },
      { upsert: true }
    );
  }

  console.log("✅ External waazi saved");
};