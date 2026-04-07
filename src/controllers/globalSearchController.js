import axios from "axios";

// Dummy example: search global www content
export const searchGlobalLectures = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Query is required" });

    // Example: You can integrate web scraping or public APIs here
    const results = await axios.get(`https://example-islamic-api.com/search?q=${encodeURIComponent(query)}`);
    
    res.json(results.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching global lectures" });
  }
};