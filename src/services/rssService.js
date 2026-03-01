import Parser from "rss-parser";
import RSSFeed from "../models/RSSFeed.js";

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "AllMuslimBackend/1.0 (+https://allmuslim.app)"
  }
});

// only allow real RSS feeds
const feeds = (process.env.RSS_FEEDS || "")
  .split(",")
  .map(f => f.trim())
  .filter(f =>
    f.startsWith("http") &&
    f.endsWith(".xml")
  );

export const updateRSSFeeds = async () => {
  if (feeds.length === 0) {
    console.log("⚠️ No valid RSS (.xml) feeds configured");
    return;
  }

  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);

      if (!feed?.items?.length) {
        console.log("⚠️ Empty RSS feed:", feedUrl);
        continue;
      }

      for (const item of feed.items) {
        if (!item.link) continue;

        await RSSFeed.updateOne(
          { sourceUrl: item.link },
          {
            title: item.title || "Untitled",
            speaker: item.creator || item.author || "Unknown",
            dateTime: item.pubDate ? new Date(item.pubDate) : new Date(),
            mediaContent: item.enclosure?.url || null,
            mediaThumbnail: item.itunes?.image || null
          },
          { upsert: true }
        );
      }

      console.log("✅ RSS saved:", feed.title);
    } catch {
      console.log("❌ RSS skipped (not real RSS):", feedUrl);
    }
  }
};