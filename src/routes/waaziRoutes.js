import express from "express";
import {
  getAllWaazi,
  getUpcomingWaazi,
} from "../controllers/waaziController.js";

const router = express.Router();

// Android → GET /api/waazi
router.get("/", getAllWaazi);

// Optional
router.get("/upcoming", getUpcomingWaazi);

export default router;