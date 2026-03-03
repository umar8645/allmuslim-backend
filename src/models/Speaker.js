import mongoose from "mongoose";

const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: String,
  country: String,
  followersCount: { type: Number, default: 0 }
});

export default mongoose.model("Speaker", speakerSchema);