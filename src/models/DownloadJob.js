// src/models/DownloadJob.js
import mongoose from "mongoose";

const DownloadJobSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  contentId: mongoose.Schema.Types.ObjectId,
  format: { type: String, enum: ["audio", "video"] },
  status: {
    type: String,
    enum: ["waiting", "processing", "ready", "failed"],
    default: "waiting"
  },
  fileUrl: String
}, { timestamps: true });

export default mongoose.model("DownloadJob", DownloadJobSchema);