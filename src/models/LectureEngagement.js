import mongoose from "mongoose";

const LectureEngagementSchema = new mongoose.Schema({
  // Reference to Lecture
  lectureId: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture", required: true },

  // Engagement metrics
  views: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },

  // Rating system
  rating: { type: Number, min: 0, max: 5, default: 0 },
  ratingCount: { type: Number, default: 0 },

  // Lifecycle timestamps
}, { timestamps: true });

// Index for fast lookup
LectureEngagementSchema.index({ lectureId: 1 }, { unique: true });

export default mongoose.model("LectureEngagement", LectureEngagementSchema);
