// src/controllers/notification.controller.js
import Notification from "../models/Notification.js";

export async function listNotifications(req, res) {
  const { userId } = req.params;
  const data = await Notification.find({ userId }).sort({ createdAt: -1 });
  res.json(data);
}

export async function markRead(req, res) {
  await Notification.updateOne(
    { _id: req.params.id },
    { $set: { read: true } }
  );
  res.json({ status: "ok" });
}