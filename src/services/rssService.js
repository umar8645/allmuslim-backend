// src/services/rss.service.js
import Parser from "rss-parser";
const parser = new Parser();

export async function fetchRSS(url) {
  try {
    const feed = await parser.parseURL(url);
    return feed.items || [];
  } catch {
    return [];
  }
}