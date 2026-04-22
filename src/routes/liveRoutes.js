import express from "express";
import { getLiveLectures } from "../controllers/liveController.js";

const router = express.Router();

router.get("/", getLiveLectures);

export default router;
