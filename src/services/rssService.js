import Parser from "rss-parser";
import RSSFeed from "../models/RSSFeed.js";
import { sendFCM } from "../utils/fcm.js"; // FCM helper

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
  const newItems = [];

  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);

      if (!feed?.items || !Array.isArray(feed.items)) {
        console.log("❌ Not a valid RSS:", feedUrl);
        continue;
      }

      for (const item of feed.items) {
        if (!item.link || !item.title) continue;

        const result = await RSSFeed.updateOne(
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

        // idan sabon item → push notification
        if (result.upserted) {
          newItems.push({
            title: item.title,
            speaker: item.creator || item.author || "Unknown",
            sourceUrl: item.link
          });

          // ✅ Auto-push FCM
          sendFCM({
            topic: "rss",
            title: `New RSS: ${item.title}`,
            body: item.creator || item.author || "AllMuslim",
            data: { url: item.link }
          });
        }
      }

      console.log("✅ RSS processed:", feed.title || feedUrl);
    } catch (err) {
      console.log("❌ RSS skipped:", feedUrl);
    }
  }

  return newItems; // za ka iya amfani dashi idan kana son logs ko further processing
};