import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Classify lecture
export const classifyLecture = async (text) => {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an Islamic lecture classifier." },
        { role: "user", content: `Classify this lecture: ${text}` }
      ]
    });

    const reply = completion?.choices?.[0]?.message?.content;
    if (!reply) {
      console.error("No reply from OpenAI:", completion);
      return "";
    }
    return reply;
  } catch (error) {
    console.error("AI classify error:", error);
    return "";
  }
};

// Summarize lecture
export const summarizeLecture = async (text) => {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "Summarize this Islamic lecture in a short paragraph." },
        { role: "user", content: text }
      ]
    });

    const reply = completion?.choices?.[0]?.message?.content;
    if (!reply) {
      console.error("No reply from OpenAI:", completion);
      return "";
    }
    return reply;
  } catch (error) {
    console.error("AI summary error:", error);
    return "";
  }
};

// Detect Quran ayah
export const detectQuranAyah = async (text) => {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "Find Quran verses mentioned in this lecture title." },
        { role: "user", content: text }
      ]
    });

    const reply = completion?.choices?.[0]?.message?.content;
    if (!reply) {
      console.error("No reply from OpenAI:", completion);
      return [];
    }
    return reply;
  } catch (error) {
    console.error("Quran detection error:", error);
    return [];
  }
};
