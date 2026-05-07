// models/Scholar.js
import mongoose from "mongoose";

const ScholarSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  bio: { type: String, trim: true },
  country: { type: String, trim: true },
  verified: { type: Boolean, default: false },
  youtubeChannel: { type: String, trim: true }
}, { timestamps: true });

// ✅ Index for fast search
ScholarSchema.index({ name: "text", country: "text", bio: "text" });

export default mongoose.model("Scholar", ScholarSchema);
