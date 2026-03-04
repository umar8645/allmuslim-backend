import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const data = await Category.find().lean();
    res.json(data);
  } catch (err) {
    console.error("❌ Category Error:", err.message);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
