import LibraryItem from "../models/LibraryItem.js";

export const getLibrary = async (req, res) => {
  try {
    const items = await LibraryItem.find().sort({ publishedAt: -1 }).limit(200);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch library items" });
  }
};