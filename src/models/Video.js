import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoId: { type: String, required: true, unique: true, index: true },
    speaker: String,
    publishedAt: Date,
    thumbnailUrl: String,
    source: { type: String, default: "youtube" }
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);