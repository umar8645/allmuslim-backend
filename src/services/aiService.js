import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// General AI service wrapper
export const runAIService = async (systemPrompt, userMessage) => {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    const reply = completion?.choices?.[0]?.message?.content;
    if (!reply) {
      console.error("No reply from OpenAI:", completion);
      return "";
    }
    return reply;
  } catch (error) {
    console.error("AI service error:", error);
    return "";
  }
};

// Example: classify lecture
export const classifyLecture = async (text) => {
  return await runAIService("You are an Islamic lecture classifier.", `Classify this lecture: ${text}`);
};

// Example: summarize lecture
export const summarizeLecture = async (text) => {
  return await runAIService("Summarize this Islamic lecture in a short paragraph.", text);
};

// Example: detect Quran ayah
export const detectQuranAyah = async (text) => {
  return await runAIService("Find Quran verses mentioned in this lecture title.", text);
};
