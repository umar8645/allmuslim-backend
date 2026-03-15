// src/crawlers/youtubeCrawler.js
import axios from "axios";

const keysEnv = process.env.YOUTUBE_API_KEYS;

if (!keysEnv) {
  console.error("❌ YOUTUBE_API_KEYS missing in .env");
  process.exit(1);
}

export const keys = keysEnv.split(",");

export const fetchYouTubeLectures = async () => {
  try {
    console.log("🔍 Fetching YouTube lectures with keys:", keys.length);
    // TODO: your actual fetching code here
  } catch (err) {
    console.error("YouTube fetch error:", err.message);
  }
};