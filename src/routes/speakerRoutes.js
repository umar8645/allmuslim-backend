import express from "express";
import {
  getSpeakers,
  followSpeaker
} from "../controllers/speakerController.js";

const router = express.Router();

router.get("/", getSpeakers);
router.post("/:speakerId/follow", followSpeaker);

export default router;