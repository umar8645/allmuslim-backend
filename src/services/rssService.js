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

      try {

        const feed = await parser.parseURL(feedUrl);

        for (const item of feed.items) {

          if (!item.link) continue;

          await RSSFeed.findOneAndUpdate(

            { sourceUrl: item.link },

            {
              title: item.title || "Untitled",
              speaker: item.creator || item.author || "Unknown",
              dateTime: item.pubDate ? new Date(item.pubDate) : new Date(),

              sourceUrl: item.link,

              mediaContent:
                item.enclosure?.url || null,

              mediaThumbnail:
                item.itunes?.image || null,

            },

            { upsert: true }

          );

        }

        console.log("RSS saved:", feed.title);

      } catch (err) {

        console.error("RSS error:", err.message);

      }

    }

  } catch (error) {

    console.error("RSS service error:", error.message);

  }

};