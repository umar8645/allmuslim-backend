import mongoose from "mongoose";

const RSSFeedSchema = new mongoose.Schema(
  {
    title: String,
    speaker: String,
    dateTime: { type: Date, index: true },
    sourceUrl: { type: String, unique: true, required: true },
    sourceType: { type: String, default: "rss" },
    mediaContent: String,
    mediaThumbnail: String
  },
  { timestamps: true }
);

RSSFeedSchema.index({ dateTime: -1 });

export default mongoose.model("RSSFeed", RSSFeedSchema);