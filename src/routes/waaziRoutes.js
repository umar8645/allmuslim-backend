import express from "express";
import { getWaazi } from "../controllers/waaziController.js";

const router = express.Router();
router.get("/", getWaazi);

export default router;