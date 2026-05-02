import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lectureTitle: String,
  lectureUrl: String,
  type: { type: String, enum: ["audio", "video"] }, 
  date: { type: Date, default: Date.now }
});

// 🔥 Indexes
historySchema.index({ user: 1, date: -1 }); // fast lookup by user/date
historySchema.index({ lectureTitle: "text", lectureUrl: "text" }); // full-text search

export default mongoose.model("History", historySchema);
