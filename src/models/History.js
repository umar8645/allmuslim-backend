import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lectureTitle: String,
  lectureUrl: String,
  type: String, // video or audio
  date: { type: Date, default: Date.now }
});

export default mongoose.model("History", historySchema);