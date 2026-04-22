import express from "express";
import { saveHistory, getUserHistory } from "../controllers/historyController.js";

const router = express.Router();

router.post("/", saveHistory);
router.get("/:userId", getUserHistory);

export default router;
