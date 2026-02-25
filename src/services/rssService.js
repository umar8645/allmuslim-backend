import Parser from "rss-parser";

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
        console.log(`RSS fetched: ${feed.title}`);
      } catch (err) {
        console.error(`RSS error (${feedUrl}):`, err.message);
      }
    }
  } catch (error) {
    console.error("RSS service error:", error.message);
  }
};
