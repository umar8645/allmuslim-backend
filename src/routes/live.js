import express from "express";
import { getLiveLectures } from "../controllers/liveController.js";
const router = express.Router();

// Fetch currently live Islamic lectures
router.get("/", getLiveLectures);

export default router;