import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    source: { type: String, enum: ["youtube", "rss"], required: true },
    videoId: { type: String, index: true },
    title: String,
    description: String,
    speaker: String,
    channelId: String,
    thumbnail: String,
    language: String,
    country: String,
    qualityScore: { type: Number, default: 0 },
    publishedAt: Date,

    // ✅ ƙara category field domin populate
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
  },
  { timestamps: true }
);

ContentSchema.index({ title: "text", description: "text" });
ContentSchema.index({ country: 1, qualityScore: -1 });

export default mongoose.model("Content", ContentSchema);
