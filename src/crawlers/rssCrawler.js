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

        const exists = await Lecture.findOne({ url: item.link })

        if (!exists) {

          await Lecture.create({
            title: item.title,
            scholar: feed.title,
            source: "rss",
            url: item.link,
            thumbnail: "",
            views: 0
          })

        }

      }

      console.log("RSS feed imported:", feed.title)

    } catch (error) {

      console.error("RSS error:", error)

    }

  }

}