import mongoose from "mongoose";

const RSSFeedSchema = new mongoose.Schema({
  title: { type: String, default: "Untitled" },
  speaker: { type: String, default: "Unknown" },
  dateTime: { type: Date, default: Date.now },

  sourceUrl: { type: String, unique: true, required: true },
  sourceType: { type: String, default: "rss" },

  mediaContent: { type: String, default: null },
  mediaThumbnail: { type: String, default: null },
  itunesImage: { type: String, default: null }

}, { timestamps: true });

export default mongoose.model("RSSFeed", RSSFeedSchema);
