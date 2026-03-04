import axios from "axios";
import Parser from "rss-parser";

const parser = new Parser();

export async function fetchRSS(url) {
  try {
    const feed = await parser.parseURL(url);

    return feed.items.map(item => ({
      title: item.title,
      contentSnippet: item.contentSnippet || item.content || "",
      pubDate: item.pubDate,
      creator: item.creator || item.author || "Unknown"
    }));

  } catch (err) {
    console.error("RSS Fetch Error:", err.message);
    return [];
  }
}