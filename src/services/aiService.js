import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const summarizeLecture = async (text) => {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Summarize in short" },
        { role: "user", content: text }
      ]
    })

    return res.choices[0].message.content || ""

  } catch {
    return ""
  }
}

export const detectQuranAyah = async (text) => {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return Quran references as JSON array" },
        { role: "user", content: text }
      ]
    })

    return JSON.parse(res.choices[0].message.content || "[]")

  } catch {
    return []
  }
}

export const classifyLecture = async (text) => {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return topic, language, keywords as JSON" },
        { role: "user", content: text }
      ]
    })

    return JSON.parse(res.choices[0].message.content || "{}")

  } catch {
    return {}
  }
}