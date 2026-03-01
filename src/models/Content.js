import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: String,
    url: { type: String, required: true, index: true },
    thumbnail: String,
    source: String,

    type: {
      type: String,
      enum: ["waazi", "rss", "youtube", "notification"],
      required: true,
      index: true
    },

    dateTime: { type: Date, index: true }
  },
  { timestamps: true }
);

export default mongoose.model("Content", ContentSchema);