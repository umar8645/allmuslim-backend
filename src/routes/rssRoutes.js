import express from "express";
import { getRSSFeeds } from "../controllers/rssController.js";

const router = express.Router();
router.get("/", getRSSFeeds);

export default router;
