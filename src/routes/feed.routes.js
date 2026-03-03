// src/routes/feed.routes.js
import express from "express";
import { getPersonalizedFeed } from "../controllers/feed.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/feed", auth, getPersonalizedFeed);

export default router;