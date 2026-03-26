import youtubeSearch from "youtube-search"
import Lecture from "../models/Lecture.js"

const keys = process.env.YOUTUBE_API_KEYS.split(",")

const getKey = () => keys[Math.floor(Math.random() * keys.length)]

export const discoverLectures = async () => {

const queries = [
"Islamic lecture",
"Quran tafsir",
"Hadith lesson",
"Islamic reminder",
"Dawah lecture"
]

for (let q of queries){

const results = await youtubeSearch(q,{
maxResults:20,
key:getKey()
})

for(let v of results.results){

const exists = await Lecture.findOne({url:v.link})

if(!exists){

await Lecture.create({
title:v.title,
scholar:v.channelTitle,
source:"youtube",
url:v.link,
thumbnail:v.thumbnails?.default?.url
})

}

}

}

console.log("Global discovery completed")

}