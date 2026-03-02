import Parser from "rss-parser";
import RSSFeed from "../models/RSSFeed.js";

const parser = new Parser({
  timeout: 20000,
  headers: {
    "User-Agent": "AllMuslimBackend/1.0"
  }
});

const feeds = (process.env.RSS_FEEDS || "")
  .split(",")
  .map(f => f.trim())
  .filter(f => f.startsWith("http"));

export const updateRSSFeeds = async () => {
  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);

      // 🛑 HARD VALIDATION
      if (!feed?.items || !Array.isArray(feed.items)) {
        console.log("❌ Not a valid RSS:", feedUrl);
        continue;
      }

      for (const item of feed.items) {
        if (!item.link || !item.title) continue;

        await RSSFeed.updateOne(
          { sourceUrl: item.link },
          {
            title: item.title,
            speaker: item.creator || item.author || "Unknown",
            dateTime: item.pubDate ? new Date(item.pubDate) : new Date(),
            mediaContent: item.enclosure?.url || null,
            mediaThumbnail: item.itunes?.image || null
          },
          { upsert: true }
        );
      }

      console.log("✅ RSS saved:", feed.title || feedUrl);
    } catch (err) {
      console.log("❌ RSS skipped:", feedUrl);
    }
  }
};