import Lecture from "../models/Lecture.js"

export const getTrendingLectures = async () => {

  const lectures = await Lecture.find()

  const scored = lectures.map(lecture => {

    const hours =
      (Date.now() - new Date(lecture.createdAt)) / (1000 * 60 * 60)

    const score =
      (lecture.views + 1) / Math.pow(hours + 2, 1.5)

    return { lecture, score }

  })

  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, 20).map(x => x.lecture)

}