import express from "express";
import {
  createScholar,
  getScholars,
  getScholarById,
  updateScholar,
  deleteScholar
} from "../controllers/scholarController.js";

const router = express.Router();

// ✅ Create scholar
router.post("/", createScholar);

// ✅ Get all scholars
router.get("/", getScholars);

// ✅ Get single scholar
router.get("/:id", getScholarById);

// ✅ Update scholar
router.put("/:id", updateScholar);

// ✅ Delete scholar
router.delete("/:id", deleteScholar);

export default router;
