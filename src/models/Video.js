import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  videoId: String,
  speaker: String,
  publishedAt: Date,
  thumbnailUrl: String,
  source: String
});

export default mongoose.model("Video", videoSchema);
