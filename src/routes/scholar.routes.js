// src/routes/scholar.routes.js
import express from "express";
import { listScholars } from "../controllers/scholar.controller.js";

const router = express.Router();
router.get("/", listScholars);
export default router;