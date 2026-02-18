// src/services/rssService.js

import axios from "axios";
import Parser from "rss-parser";
import RSSFeed from "../models/RSSFeed.js";

const parser = new Parser({
  timeout: 10000
});

export const updateRSSFeeds = async () => {
  const feeds =
    process.env.RSS_FEEDS?.split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0) || [];

  if (!feeds.length) {
    console.warn("⚠️ No RSS_FEEDS configured");
    return;
  }

  for (const url of feeds) {
    try {
      // Fetch manually with headers (fix Render blocking issue)
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          Accept: "application/rss+xml, application/xml"
        },
        timeout: 10000
      });

      const feed = await parser.parseString(response.data);

      if (!feed.items || !feed.items.length) {
        console.warn("⚠️ RSS returned no items:", url);
        continue;
      }

      for (const item of feed.items.slice(0, 10)) {
        if (!item.link) continue;

        await RSSFeed.updateOne(
          { sourceUrl: item.link },
          {
            title: item.title || "Untitled",
            speaker: feed.title || "RSS Source",
            dateTime: item.pubDate
              ? new Date(item.pubDate)
              : new Date(),
            sourceUrl: item.link,
            sourceType: "rss",
            mediaContent: item.enclosure?.url || null,
            mediaThumbnail:
              item.itunes?.image ||
              item.enclosure?.url ||
              null
          },
          { upsert: true }
        );
      }

      console.log("✅ RSS updated:", feed.title || url);
    } catch (err) {
      console.error(
        `❌ RSS failed for ${url}:`,
        err.response?.status || err.message
      );
    }
  }
};