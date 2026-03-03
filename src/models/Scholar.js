// src/models/Scholar.js
import mongoose from "mongoose";

const ScholarSchema = new mongoose.Schema({
  name: { type: String, index: true },
  channelId: { type: String, index: true },
  country: { type: String, index: true },
  language: String,

  trustScore: { type: Number, default: 50 },

  stats: {
    totalContent: { type: Number, default: 0 },
    avgQuality: { type: Number, default: 0 },
    duplicateRate: { type: Number, default: 0 },
    sources: [String],
    lastPublishedAt: Date,
  },
}, { timestamps: true });

ScholarSchema.index({ trustScore: -1 });

export default mongoose.model("Scholar", ScholarSchema);