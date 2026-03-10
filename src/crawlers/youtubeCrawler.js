import youtubeSearch from "youtube-search"
import Lecture from "../models/Lecture.js"

const keys = process.env.YOUTUBE_API_KEYS.split(",")

const getRandomKey = () => {
  return keys[Math.floor(Math.random() * keys.length)]
}

export const fetchYouTubeLectures = async () => {

  try {

    const opts = {
      maxResults: 10,
      key: getRandomKey()
    }

    const results = await youtubeSearch("Islamic lecture", opts)

    for (let video of results.results) {

      const exists = await Lecture.findOne({ url: video.link })

      if (!exists) {

        await Lecture.create({
          title: video.title,
          scholar: video.channelTitle || "YouTube",
          source: "youtube",
          url: video.link,
          thumbnail: video.thumbnails?.default?.url || "",
          views: 0
        })

      }

    }

    console.log("YouTube lectures imported")

  } catch (error) {

    console.error("YouTube crawler error:", error)

  }

}