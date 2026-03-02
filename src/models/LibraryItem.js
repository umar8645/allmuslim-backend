import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
  title: String,
  speaker: String,
  publishedAt: Date,
  sourceUrl: String
}, { timestamps: true });

export default mongoose.model("LibraryItem", librarySchema);