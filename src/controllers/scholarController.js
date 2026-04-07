import Scholar from "../models/Scholar.js";

// ✅ Create new scholar
export const createScholar = async (req, res) => {
  try {
    const scholar = await Scholar.create(req.body);
    res.json(scholar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all scholars
export const getScholars = async (req, res) => {
  try {
    const scholars = await Scholar.find();
    res.json(scholars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single scholar
export const getScholarById = async (req, res) => {
  try {
    const scholar = await Scholar.findById(req.params.id);
    if (!scholar) return res.status(404).json({ message: "Scholar not found" });
    res.json(scholar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update scholar
export const updateScholar = async (req, res) => {
  try {
    const scholar = await Scholar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scholar) return res.status(404).json({ message: "Scholar not found" });
    res.json(scholar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete scholar
export const deleteScholar = async (req, res) => {
  try {
    const scholar = await Scholar.findByIdAndDelete(req.params.id);
    if (!scholar) return res.status(404).json({ message: "Scholar not found" });
    res.json({ message: "Scholar deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
