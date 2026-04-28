import Parser from "rss-parser";
import Lecture from "../models/Lecture.js";
import { summarizeLecture, detectQuranAyah, classifyLecture } from "./aiService.js";

const parser = new Parser();

const feeds = [
  "https://muslimmatters.org/feed/",
  "https://islamqa.info/en/rss",
  "https://www.islamweb.net/en/rss/index.php",
  "https://www.halaltube.com/feed",
  "https://muslimcentral.com/feed",
  "https://bayyinah.com/feed",
  "https://islamicfinder.org/news/feed"
];

// ✅ RSS import
export const fetchRSSLectures = async () => {
  for (let url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      for (let item of feed.items) {
        const exists = await Lecture.findOne({ url: item.link });
        if (!exists) {
          const summary = await summarizeLecture(item.title);
          const ayahs = await detectQuranAyah(item.title);
          const classification = await classifyLecture(item.title);

          await Lecture.create({
            title: item.title,
            scholar: feed.title || "Unknown Scholar",
            source: "rss",
            platform: "rss",
            url: item.link,
            thumbnail: item.enclosure?.url || "",
            transcript: summary,
            quranReferences: ayahs,
            classification
          });
        }
      }
      console.log(`✅ RSS imported: ${feed.title}`);
    } catch (error) {
      console.error("RSS error:", error.message);
    }
  }
};

// ✅ Trending lectures
export const getTrendingLectures = async () => {
  try {
    const lectures = await Lecture.find({ source: "rss" })
      .sort({ createdAt: -1 })
      .limit(10);

    return lectures;
  } catch (error) {
    console.error("❌ Error fetching trending lectures:", error.message);
    throw error;
  }
};
