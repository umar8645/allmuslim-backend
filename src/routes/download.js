import express from "express";
import { downloadLecture } from "../controllers/downloadController.js";

const router = express.Router();

router.get("/:id", downloadLecture);

// Wannan dole ne ya kasance default export
export default router;
