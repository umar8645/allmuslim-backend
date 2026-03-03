// src/controllers/follow.controller.js
import Follow from "../models/Follow.js";

export async function followScholar(req, res) {
  const { userId, scholarId } = req.body;
  await Follow.create({ userId, scholarId });
  res.json({ status: "followed" });
}

export async function unfollowScholar(req, res) {
  const { userId, scholarId } = req.body;
  await Follow.deleteOne({ userId, scholarId });
  res.json({ status: "unfollowed" });
}

export async function listFollowing(req, res) {
  const { userId } = req.params;
  const data = await Follow.find({ userId }).populate("scholarId");
  res.json(data);
}