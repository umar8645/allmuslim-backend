import OpenAI from "openai"
import fs from "fs"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const transcribeAudio = async (filePath) => {

  try {

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "gpt-4o-transcribe"
    })

    return transcription.text

  } catch (error) {

    console.error(error)

  }

}