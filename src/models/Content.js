import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: { type: String, index: true },
  thumbnail: String,
  source: String,
  type: { type: String, enum: ["waazi", "rss", "youtube", "notification"], index: true },
  dateTime: { type: Date, index: true }
}, { timestamps: true });

ContentSchema.index({ type: 1, dateTime: -1 });

export default mongoose.model("Content", ContentSchema);