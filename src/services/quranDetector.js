import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const detectQuranAyah = async (text) => {

  try {

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You detect Quran verses mentioned in Islamic lectures."
        },
        {
          role: "user",
          content: "Find Quran ayahs mentioned in this text and return Surah name and verse number: " + text
        }
      ]
    })

    return completion.choices[0].message.content

  } catch (error) {

    console.error(error)

  }

}