import express from "express";
import { getUpcomingWaazi, getPastWaazi } from "../controllers/waaziController.js";

const router = express.Router();
router.get("/upcoming", getUpcomingWaazi);
router.get("/past", getPastWaazi);

export default router;
