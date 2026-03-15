import Lecture from "../models/Lecture.js";
import Parser from "rss-parser";
import youtubeSearch from "youtube-search";
import { summarizeLecture, detectQuranAyah, classifyLecture } from "../services/aiService.js";

const parser = new Parser();

const feeds = [
  "https://muslimmatters.org/feed/",
  "https://islamqa.info/en/rss",
  "https://www.islamweb.net/en/rss/index.php",
];

const youtubeKeys = process.env.YOUTUBE_API_KEYS.split(",");
const getRandomKey = () => youtubeKeys[Math.floor(Math.random() * youtubeKeys.length)];

export const fetchYouTubeLectures = async () => {
  try {
    const results = await youtubeSearch("Islamic lecture", { maxResults: 10, key: getRandomKey() });
    for (let video of results.results) {
      const exists = await Lecture.findOne({ url: video.link });
      if (!exists) {
        // AI processing
        const summary = await summarizeLecture(video.title);
        const ayahs = await detectQuranAyah(video.title);
        const classification = await classifyLecture(video.title);

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
          classification: classification,
        });
      }
    }
    console.log("YouTube lectures imported");
  } catch (error) {
    console.error("YouTube crawler error:", error);
  }
};

export const fetchRSSLectures = async () => {
  for (let url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      for (let item of feed.items) {
        if (!(await Lecture.findOne({ url: item.link }))) {
          // AI processing
          const summary = await summarizeLecture(item.title);
          const ayahs = await detectQuranAyah(item.title);
          const classification = await classifyLecture(item.title);

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
            classification: classification,
          });
        }
      }
      console.log("RSS imported:", feed.title);
    } catch (error) {
      console.error("RSS error:", error);
    }
  }
};
