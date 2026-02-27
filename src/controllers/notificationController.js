import Content from "../models/Content.js";

export async function getNotifications(req, res) {
  try {
    const items = await Content.find({ type: "notification" })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}