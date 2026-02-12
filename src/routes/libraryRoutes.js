import { Router } from "express";
import { getLibrary } from "../controllers/libraryController.js";

const router = Router();

// GET /api/library
router.get("/", getLibrary);

export default router;
