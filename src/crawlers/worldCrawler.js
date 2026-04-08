import Lecture from "../models/Lecture.js";
import Parser from "rss-parser";
import youtubeSearch from "youtube-search";
import { summarizeLecture, detectQuranAyah } from "../services/aiService.js";

const parser = new Parser();

// ✅ Ƙara RSS feeds masu yawa
const feeds = [
  "https://muslimmatters.org/feed/",
  "https://islamqa.info/en/rss",
  "https://www.islamweb.net/en/rss/index.php",
  "https://www.halaltube.com/feed",
  "https://muslimcentral.com/feed/",
  "https://bayyinah.com/feed",
  "https://islamicfinder.org/news/feed"
];

// ✅ Keywords da yawa don YouTube
const youtubeKeys = process.env.YOUTUBE_API_KEYS.split(",");
const getRandomKey = () => youtubeKeys[Math.floor(Math.random() * youtubeKeys.length)];
const keywords = [
  "Islamic lecture",
  "Quran tafsir",
  "Hadith class",
  "Khutbah",
  "Ramadan lecture",
  "Islamic reminder",
  "Islamic motivation",
  "Islamic story",
  "Islamic education"
];

export const fetchYouTubeLectures = async () => {
  try {
    let count = 0;
    for (let keyword of keywords) {
      const results = await youtubeSearch(keyword, { maxResults: 10, key: getRandomKey() });
      for (let video of results.results) {
        const exists = await Lecture.findOne({ url: video.link });
        if (!exists) {
          const summary = await summarizeLecture(video.title);
          const ayahs = await detectQuranAyah(video.title);

          await Lecture.create({
            title: video.title,
            scholar: video.channelTitle || "YouTube",
            source: "youtube",
            platform: "youtube",
            url: video.link,
            thumbnail: video.thumbnails?.default?.url || "",
            views: 0,
            transcript: summary,
            quranReferences: ayahs,
          });
          count++;
        }
      }
    }
    console.log(`✅ YouTube lectures imported: ${count} new lectures`);
  } catch (error) {
    console.error("YouTube crawler error:", error);
  }
};

export const fetchRSSLectures = async () => {
  for (let url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      let count = 0;
      for (let item of feed.items) {
        if (!(await Lecture.findOne({ url: item.link }))) {
          const summary = await summarizeLecture(item.title);
          const ayahs = await detectQuranAyah(item.title);

          await Lecture.create({
            title: item.title,
            scholar: feed.title,
            source: "rss",
            platform: "blog",
            url: item.link,
            thumbnail: "",
            views: 0,
            transcript: summary,
            quranReferences: ayahs,
          });
          count++;
        }
      }
      console.log(`✅ RSS imported from ${feed.title}: ${count} new lectures`);
    } catch (error) {
      console.error("RSS error:", error);
    }
  }
};
