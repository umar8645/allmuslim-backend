import express from "express";
import { searchGlobalLectures } from "../controllers/globalSearchController.js";

const router = express.Router();

router.get("/", searchGlobalLectures);

export default router;
