import youtubeSearch from "youtube-search"
import Lecture from "../models/Lecture.js"
import { summarizeLecture, detectQuranAyah, classifyLecture } from "../services/aiService.js"

const keysEnv = process.env.YOUTUBE_API_KEYS
if (!keysEnv) {
  console.error("❌ YOUTUBE_API_KEYS missing")
  process.exit(1)
}
const keys = keysEnv.split(",")
const getKey = () => keys[Math.floor(Math.random() * keys.length)]

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
]

export const fetchYouTubeLectures = async () => {
  try {
    for (let keyword of keywords) {
      const results = await youtubeSearch(keyword, { maxResults: 10, key: getKey() })
      for (let video of results.results) {
        const exists = await Lecture.findOne({ url: video.id })
        if (!exists) {
          let summary = ""
          let ayahs = []
          let classification = ""

          if (process.env.ENABLE_AI === "true") {
            summary = await summarizeLecture(video.title)
            ayahs = await detectQuranAyah(video.title)
            classification = await classifyLecture(video.title)
          }

          await Lecture.create({
            title: video.title,
            scholar: video.channelTitle || "YouTube",
            source: "youtube",
            platform: "youtube",
            url: video.id, // videoId
            thumbnail: video.thumbnails?.default?.url || "",
            transcript: summary,
            quranReferences: ayahs,
            classification
          })
        }
      }
    }
    console.log("✅ YouTube lectures imported")
  } catch (error) {
    console.error("YouTube crawler error:", error.message)
  }
}
