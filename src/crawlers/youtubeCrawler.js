import youtubeSearch from "youtube-search"
import Lecture from "../models/Lecture.js"

const opts = {
  maxResults: 10,
  key: process.env.YOUTUBE_API_KEY
}

export const fetchYouTubeLectures = async () => {
  try {

    const results = await youtubeSearch("Islamic lecture", opts)

    for (let video of results.results) {

      const exists = await Lecture.findOne({ url: video.link })

      if (!exists) {
        await Lecture.create({
          title: video.title,
          scholar: video.channelTitle,
          source: "youtube",
          url: video.link,
          thumbnail: video.thumbnails.default.url,
          views: 0
        })
      }

    }

    console.log("YouTube lectures imported")

  } catch (error) {
    console.error(error)
  }
}