import mongoose from "mongoose";

const liveLectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true }, // processed video path
  scholar: { type: String, required: true },
  thumbnail: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("LiveLecture", liveLectureSchema);
