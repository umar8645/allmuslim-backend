import axios from "axios";
import Parser from "rss-parser";
import Content from "../models/Content.js";

const parser = new Parser();

export const updateRSSFeeds = async () => {
  if (!process.env.RSS_FEEDS) return;

  const feeds = process.env.RSS_FEEDS.split(",");

  for (const url of feeds) {
    try {
      const response = await axios.get(url);
      const feed = await parser.parseString(response.data);

      for (const item of feed.items.slice(0, 10)) {
        if (!item.link) continue;

        await Content.updateOne(
          { sourceUrl: item.link },
          {
            title: item.title,
            speaker: feed.title,
            dateTime: item.pubDate
              ? new Date(item.pubDate)
              : new Date(),
            sourceUrl: item.link,
            sourceType: "rss",
            mediaContent: item.enclosure?.url,
            mediaThumbnail:
              item.itunes?.image ||
              item.enclosure?.url
          },
          { upsert: true }
        );
      }

      console.log("✅ RSS updated:", url);

    } catch (err) {
      console.error("❌ RSS error:", err.message);
    }
  }
};