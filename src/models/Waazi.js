import mongoose from "mongoose";

const waaziSchema = new mongoose.Schema({
  title: String,
  speaker: String,
  dateTime: Date,
  location: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Waazi", waaziSchema);
