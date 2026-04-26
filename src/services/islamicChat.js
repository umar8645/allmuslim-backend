import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const islamicChat = async (req, res) => {
  console.log("Incoming body:", req.body);
  console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "Loaded" : "Missing");

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an Islamic assistant that answers using Quran and Hadith." },
        { role: "user", content: message }
      ]
    });

    const reply = completion?.choices?.[0]?.message?.content;
    if (!reply) {
      console.error("No reply from OpenAI:", completion);
      return res.status(500).json({ error: "Empty AI response" });
    }

    res.json({ reply });
  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ error: "AI service error", details: err.message });
  }
};
