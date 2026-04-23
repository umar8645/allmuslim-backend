import express from "express";
import { downloadLecture } from "../controllers/downloadController.js";

const router = express.Router();

router.get("/:id", downloadLecture);

export default router;
