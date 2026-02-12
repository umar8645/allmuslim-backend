import Parser from "rss-parser";
import RSSFeed from "../models/RSSFeed.js";

const parser = new Parser();

const feeds = process.env.RSS_FEEDS
  ? process.env.RSS_FEEDS.split(",")
  : [];

export const updateRSSFeeds = async () => {
  try {
    if (feeds.length === 0) {
      console.log("No RSS feeds configured");
      return;
    }

    for (const feedUrl of feeds) {
      const feed = await parser.parseURL(feedUrl);

      for (const item of feed.items.slice(0, 5)) {
        await RSSFeed.updateOne(
          { sourceUrl: item.link }, // unique field
          {
            title: item.title || "Untitled",
            speaker: feed.title || "Unknown",
            dateTime: item.pubDate ? new Date(item.pubDate) : new Date(),

            sourceUrl: item.link,
            sourceType: "rss",

            mediaContent: item.enclosure?.url || null,
            mediaThumbnail: item.itunes?.image || null,
            itunesImage: item.itunes?.image || null
          },
          { upsert: true }
        );
      }

      console.log(`✅ RSS saved: ${feed.title}`);
    }
  } catch (error) {
    console.error("RSS service error:", error.message);
  }
};