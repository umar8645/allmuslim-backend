// src/controllers/followController.js
import { followSpeaker } from "../services/follow.service.js";

export async function follow(req, res) {
  const { speaker, channelId } = req.body;
  await followSpeaker(req.userId, speaker, channelId);
  res.json({ success: true });
}