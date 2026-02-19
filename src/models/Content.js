import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    speaker: String,

    sourceType: {
      type: String,
      enum: ["youtube", "rss", "waazi"],
      required: true,
      index: true
    },

    sourceUrl: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    mediaThumbnail: String,
    mediaContent: String,

    dateTime: {
      type: Date,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

// 🔥 compound index for feed performance
contentSchema.index({ sourceType: 1, dateTime: -1 });

export default mongoose.model("Content", contentSchema);