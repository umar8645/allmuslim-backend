import axios from "axios";

export const searchGlobalLectures = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Query is required" });

    // Example external API call
    const results = await axios.get(`https://example-islamic-api.com/search?q=${encodeURIComponent(query)}`);
    res.json(results.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching global lectures" });
  }
};
