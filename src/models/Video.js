import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  videoId: { type: String, unique: true, index: true },
  speaker: String,
  publishedAt: Date,
  thumbnailUrl: String,
  source: String
}, { timestamps: true });

export default mongoose.model("Video", videoSchema);