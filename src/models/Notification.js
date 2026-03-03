// src/models/Notification.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true },
    title: String,
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);