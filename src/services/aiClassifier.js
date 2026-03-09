import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const classifyLecture = async (text) => {

  try {

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an Islamic lecture classifier."
        },
        {
          role: "user",
          content: "Classify this Islamic lecture and return topic, language and keywords: " + text
        }
      ]
    })

    return completion.choices[0].message.content

  } catch (error) {

    console.error(error)

  }

}