import Parser from "rss-parser"
import Lecture from "../models/Lecture.js"
import { summarizeLecture, detectQuranAyah } from "../services/aiService.js"

const parser = new Parser()

// ✅ Ƙara feeds masu yawa
const feeds = [
  "https://muslimmatters.org/feed/",
  "https://islamqa.info/en/rss",
  "https://www.islamweb.net/en/rss/index.php",
  "https://www.halaltube.com/feed",
  "https://muslimcentral.com/feed/",
  "https://bayyinah.com/feed",
  "https://islamicfinder.org/news/feed"
]

export const fetchRSSLectures = async () => {
  for (let url of feeds) {
    try {
      const feed = await parser.parseURL(url)
      for (let item of feed.items) {
        const exists = await Lecture.findOne({ url: item.link })
        if (!exists) {
          let summary = ""
          let ayahs = []

          if (process.env.ENABLE_AI === "true") {
            summary = await summarizeLecture(item.title)
            ayahs = await detectQuranAyah(item.title)
          }

          await Lecture.create({
            title: item.title,
            scholar: feed.title,
            source: "rss",
            platform: "blog",
            url: item.link,
            thumbnail: "",
            views: 0,
            transcript: summary,
            quranReferences: ayahs
          })
        }
      }
      console.log("✅ RSS imported:", feed.title)
    } catch (error) {
      console.error("RSS error:", error)
    }
  }
}
