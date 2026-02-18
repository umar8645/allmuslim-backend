import Parser from "rss-parser";
import RSSFeed from "../models/RSSFeed.js";

const parser = new Parser();

export const updateRSSFeeds = async () => {
  const feeds = process.env.RSS_FEEDS?.split(",") || [];

  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url.trim());

      for (const item of feed.items.slice(0, 10)) {
        await RSSFeed.updateOne(
          { sourceUrl: item.link },
          {
            title: item.title,
            speaker: feed.title,
            dateTime: item.pubDate ? new Date(item.pubDate) : new Date(),
            sourceUrl: item.link,
            sourceType: "rss",
            mediaContent: item.enclosure?.url || null,
            mediaThumbnail: item.itunes?.image || null
          },
          { upsert: true }
        );
      }

      console.log("✅ RSS updated:", feed.title);
    } catch (err) {
      console.error("❌ RSS failed:", url);
    }
  }
};