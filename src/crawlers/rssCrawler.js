import Parser from "rss-parser"
import Lecture from "../models/Lecture.js"

const parser = new Parser()

const feeds = [
  "https://muslimmatters.org/feed/",
  "https://islamqa.info/en/rss",
  "https://www.islamweb.net/en/rss/index.php"
]

export const fetchRSSLectures = async () => {
  for (let url of feeds) {
    try {
      const feed = await parser.parseURL(url)

      for (let item of feed.items) {

        if (await Lecture.findOne({ url: item.link })) continue

        await Lecture.create({
          title: item.title,
          scholar: feed.title,
          source: "rss",
          url: item.link
        })
      }

      console.log("✅ RSS:", feed.title)

    } catch (err) {
      console.error("RSS error:", err.message)
    }
  }
}