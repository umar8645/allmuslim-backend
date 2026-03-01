import Parser from "rss-parser";
import RSSFeed from "../models/RSSFeed.js";

const parser = new Parser({ timeout: 15000 });

const feeds = (process.env.RSS_FEEDS || "")
  .split(",")
  .map(f => f.trim())
  .filter(f => f.startsWith("http"));

export const updateRSSFeeds = async () => {
  if (feeds.length === 0) {
    console.log("⚠️ No valid RSS feeds configured");
    return;
  }

  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);

      for (const item of feed.items || []) {
        if (!item.link) continue;

        await RSSFeed.updateOne(
          { sourceUrl: item.link },
          {
            title: item.title,
            speaker: item.creator || item.author,
            dateTime: item.pubDate ? new Date(item.pubDate) : new Date(),
            mediaContent: item.enclosure?.url,
            mediaThumbnail: item.itunes?.image
          },
          { upsert: true }
        );
      }

      console.log("✅ RSS saved:", feed.title);
    } catch (err) {
      console.error("❌ RSS skipped:", feedUrl);
    }
  }
};