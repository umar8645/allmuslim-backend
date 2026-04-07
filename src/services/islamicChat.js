// src/services/islamicChat.js
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("❌ OPENAI_API_KEY missing in .env");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

export const islamicChat = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(500).json({ error: "Message is required" });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an Islamic assistant that answers using Quran and Hadith." },
        { role: "user", content: message }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI Error:", err.message);
    res.status(500).json({ error: "AI service error" });
  }
};
