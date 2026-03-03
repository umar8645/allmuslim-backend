// src/routes/follow.routes.js
import express from "express";
import {
  followScholar,
  unfollowScholar,
  listFollowing,
} from "../controllers/follow.controller.js";

const router = express.Router();

router.post("/follow", followScholar);
router.post("/unfollow", unfollowScholar);
router.get("/:userId", listFollowing);

export default router;