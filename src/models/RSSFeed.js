import mongoose from "mongoose";

const RSSFeedSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Untitled" },
    speaker: { type: String, default: "Unknown" },
    dateTime: { type: Date, index: true },

    sourceUrl: { type: String, required: true, unique: true, index: true },

    mediaContent: String,
    mediaThumbnail: String
  },
  { timestamps: true }
);

export default mongoose.model("RSSFeed", RSSFeedSchema);