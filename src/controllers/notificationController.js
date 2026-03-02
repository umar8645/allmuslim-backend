import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};