import mongoose from "mongoose";

const waaziSchema = new mongoose.Schema(
  {
    title: String,
    speaker: String,
    dateTime: { type: Date, index: true },
    location: String,
    tags: [String]
  },
  { timestamps: true }
);

export default mongoose.model("Waazi", waaziSchema);