import youtubeSearch from "youtube-search"
import Lecture from "../models/Lecture.js"
import { summarizeLecture, detectQuranAyah, classifyLecture } from "../services/aiService.js"

const keys = process.env.YOUTUBE_API_KEYS.split(",")
const getKey = () => keys[Math.floor(Math.random() * keys.length)]

export const fetchYouTubeLectures = async () => {
  try {
    const results = await youtubeSearch("Islamic lecture", {
      maxResults: 10,
      key: getKey()
    })

    for (let v of results.results) {

      const exists = await Lecture.findOne({ url: v.link })
      if (exists) continue

      const summary = await summarizeLecture(v.title)
      const ayahs = await detectQuranAyah(v.title)
      const classification = await classifyLecture(v.title)

      await Lecture.create({
        title: v.title,
        scholar: v.channelTitle || "YouTube",
        source: "youtube",
        platform: "youtube",
        url: v.link,
        thumbnail: v.thumbnails?.default?.url || "",
        transcript: summary,
        quranReferences: ayahs,
        classification
      })
    }

    console.log("✅ YouTube imported")

  } catch (err) {
    console.error("YouTube error:", err.message)
  }
}