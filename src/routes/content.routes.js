// src/routes/content.routes.js
import express from "express";
import { listContent, getContent } from "../controllers/content.controller.js";

const router = express.Router();

router.get("/", listContent);
router.get("/:id", getContent);

export default router;