// src/routes/waaziRoutes.js
import express from "express";
import {
  getAllWaazi,
  getUpcomingWaazi,
} from "../controllers/waaziController.js";

const router = express.Router();

// GET /api/waazi
router.get("/", getAllWaazi);

// GET /api/waazi/upcoming
router.get("/upcoming", getUpcomingWaazi);

export default router;