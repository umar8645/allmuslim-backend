import Content from "../models/Content.js";

export const getWaazi = async (req, res) => {
  try {
    const { category, country, speaker, q } = req.query;
    const filter = { type: "waazi" };

    if (country) filter.country = country;
    if (category) filter.category = category;
    if (speaker) filter.speaker = speaker;
    if (q) filter.title = new RegExp(q, "i");

    const data = await Content.find(filter)
      // ✅ populate category zai yi aiki saboda mun ƙara ref a Content.js
      .populate("category", "name image")
      // ❌ cire populate speaker saboda speaker field ɗinka string ne
      .sort({ publishedAt: -1 })
      .limit(100)
      .lean();

    res.json(data);
  } catch (err) {
    console.error("❌ Waazi Error:", err.message);
    res.status(500).json({ error: "Failed to fetch waazi" });
  }
};
