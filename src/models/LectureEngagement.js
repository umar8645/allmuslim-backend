// models/LectureEngagement.js
import mongoose from "mongoose";

const LectureEngagementSchema = new mongoose.Schema({
  lectureId: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture", required: true },

  views: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },

  rating: { type: Number, min: 0, max: 5, default: 0 },
  ratingCount: { type: Number, default: 0 }
}, { timestamps: true });

// ✅ Fast lookup
LectureEngagementSchema.index({ lectureId: 1 }, { unique: true });

export default mongoose.model("LectureEngagement", LectureEngagementSchema);
