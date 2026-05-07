// routes/globalSearchRoutes.js
import express from "express";
import { searchGlobalLectures } from "../controllers/globalSearchController.js";

const router = express.Router();

// ✅ Global search across lectures
router.get("/", searchGlobalLectures);

export default router;
