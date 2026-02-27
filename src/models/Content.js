import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    url: { type: String, required: true },
    thumbnail: String,
    source: String,

    type: {
      type: String,
      enum: ["waazi", "rss", "youtube", "notification"],
      required: true,
    },

    publishedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Content", ContentSchema);