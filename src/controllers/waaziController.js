import Waazi from "../models/Waazi.js";

export async function getUpcomingWaazi(req, res) {
  const now = new Date();
  const waazi = await Waazi.find({ dateTime: { $gte: now } }).sort({ dateTime: 1 });
  res.json(waazi);
}

export async function getPastWaazi(req, res) {
  const now = new Date();
  const waazi = await Waazi.find({ dateTime: { $lt: now } }).sort({ dateTime: -1 });
  res.json(waazi);
}
