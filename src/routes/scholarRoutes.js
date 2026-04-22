import express from "express";
import { createScholar, getScholars, getScholarById, updateScholar, deleteScholar } from "../controllers/scholarController.js";

const router = express.Router();

router.post("/", createScholar);
router.get("/", getScholars);
router.get("/:id", getScholarById);
router.put("/:id", updateScholar);
router.delete("/:id", deleteScholar);

export default router;
