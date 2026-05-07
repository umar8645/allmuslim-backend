// routes/topRoutes.js
import express from "express";
import { getTopByViews, getTopByLikes, getTopByRating, getTopTrending } from "../controllers/topLecturesController.js";

const router = express.Router();

// ✅ Top lectures by views
router.get("/views", getTopByViews);

// ✅ Top lectures by likes
router.get("/likes", getTopByLikes);

// ✅ Top lectures by rating
router.get("/rating", getTopByRating);

// ✅ Top trending lectures (custom score)
router.get("/trending", getTopTrending);

export default router;
