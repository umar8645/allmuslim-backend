import express from "express";
import { searchGlobalLectures } from "../controllers/globalSearchController.js";
const router = express.Router();

// Search Islamic lectures globally
router.get("/", searchGlobalLectures);

export default router;