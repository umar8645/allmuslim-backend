import Lecture from "../models/Lecture.js"
import { getTrendingLectures } from "../services/trendingService.js"

export const getLectures = async (req,res)=>{
  const lectures = await Lecture.find().sort({createdAt:-1})
  res.json(lectures)
}

export const getTrending = async (req,res)=>{
  const lectures = await getTrendingLectures()
  res.json(lectures)
}