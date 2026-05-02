import express from "express";
import { saveHistory, getUserHistory, searchUserHistory } from "../controllers/historyController.js";

const router = express.Router();

// Save history
router.post("/", saveHistory);

// Get user history (with pagination + filtering)
router.get("/:userId", getUserHistory);

// Full-text search in history
router.get("/search/:userId", searchUserHistory);

export default router;
