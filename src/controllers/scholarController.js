import Scholar from "../models/Scholar.js";

export const createScholar = async (req, res) => {
  try {
    const exists = await Scholar.findOne({ name: req.body.name });
    if (exists) return res.status(400).json({ message: "Scholar already exists" });

    const scholar = await Scholar.create(req.body);
    res.json(scholar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getScholars = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const totalCount = await Scholar.countDocuments();

    const scholars = await Scholar.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ totalCount, page, results: scholars });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getScholarById = async (req, res) => {
  try {
    const scholar = await Scholar.findById(req.params.id);
    if (!scholar) return res.status(404).json({ message: "Scholar not found" });
    res.json(scholar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateScholar = async (req, res) => {
  try {
    const scholar = await Scholar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scholar) return res.status(404).json({ message: "Scholar not found" });
    res.json(scholar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteScholar = async (req, res) => {
  try {
    const scholar = await Scholar.findByIdAndDelete(req.params.id);
    if (!scholar) return res.status(404).json({ message: "Scholar not found" });
    res.json({ message: "Scholar deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
