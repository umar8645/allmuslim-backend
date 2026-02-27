import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    speaker: String,
    sourceType: {
      type: String,
      enum: ["youtube", "rss", "external"],
      required: true,
    },
    sourceUrl: String,
    mediaThumbnail: String,
    mediaContent: String,
    publishedAt: Date,
    dateTime: Date,
    location: String,
  },
  { timestamps: true }
);

export default mongoose.model("Content", ContentSchema);