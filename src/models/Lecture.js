import mongoose from "mongoose"

const LectureSchema = new mongoose.Schema({

title: String,
scholar: String,
source: String,
platform: String,
url: String,
thumbnail: String,

views: {
type: Number,
default: 0
},

topic: String,
language: String,
keywords: [String],

transcript: String,
quranReferences: [String],

classification: String,

createdAt: {
type: Date,
default: Date.now
}

})

LectureSchema.index({
title: "text",
scholar: "text",
topic: "text",
keywords: "text",
transcript: "text"
})

LectureSchema.index({ createdAt: -1 })
LectureSchema.index({ url: 1 }, { unique: true })

export default mongoose.model("Lecture", LectureSchema)
