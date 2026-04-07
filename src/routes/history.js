import express from "express";
import { saveHistory, getUserHistory } from "../controllers/historyController.js";

const router = express.Router();

// ✅ Save history
router.post("/", saveHistory);

// ✅ Get history by user
router.get("/:userId", getUserHistory);

export default router;
