// models/Lecture.js
import mongoose from "mongoose";

const LectureSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  scholar: { type: String, required: true, trim: true },
  source: { type: String, trim: true },
  platform: { type: String, enum: ["youtube", "rss-media", "rss-page"], required: true },
  url: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => /^https?:\/\//.test(v),
      message: props => `${props.value} is not a valid URL`
    }
  },
  pageUrl: { type: String, trim: true },
  slug: { type: String, unique: true },

  thumbnail: {
    type: String,
    default: "",
    validate: {
      validator: v => !v || /^https?:\/\//.test(v),
      message: props => `${props.value} is not a valid thumbnail URL`
    }
  },

  duration: { type: Number, default: 0 },
  fileSize: { type: Number, default: 0 },
  format: { type: String, enum: ["mp3", "mp4", "pdf", "other"], default: "mp4" },
  quality: { type: String, enum: ["low", "medium", "high", "hd"], default: "medium" },
  isDownloadable: { type: Boolean, default: true },

  views: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },

  topic: { type: String },   // ❌ cire index: true
  language: { type: String, default: "Arabic" },
  keywords: { type: [String] }, // ❌ cire index: true
  transcript: { type: String },
  quranReferences: { type: [String] },
  hadithReferences: { type: [String] },
  classification: { type: String },
  tags: { type: [String], default: [] },

  rating: { type: Number, min: 0, max: 5, default: 0 },
  ratingCount: { type: Number, default: 0 },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  publishedAt: { type: Date },
  deletedAt: { type: Date },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// ✅ Indexes for fast search
LectureSchema.index({
  title: "text",
  scholar: "text",
  topic: "text",
  keywords: "text",
  transcript: "text",
  tags: "text"
});

LectureSchema.index({ createdAt: -1 });
LectureSchema.index({ url: 1 }, { unique: true });
LectureSchema.index({ scholar: 1 });
LectureSchema.index({ platform: 1 });
LectureSchema.index({ language: 1 });
LectureSchema.index({ topic: 1 });
LectureSchema.index({ slug: 1 }, { unique: true });

export default mongoose.model("Lecture", LectureSchema);
