import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    speaker: String,
    sourceType: {
      type: String,
      enum: ["youtube", "rss", "external"],
      required: true,
    },
    sourceId: String,
    url: String,
    thumbnail: String,
    publishedAt: Date,
    dateTime: Date,
    location: String,
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", ContentSchema);

export default Content;