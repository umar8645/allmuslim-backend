// src/models/Follow.js
import mongoose from "mongoose";

const FollowSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, index: true },
  scholarId: { type: mongoose.Schema.Types.ObjectId, ref: "Scholar" }
}, { timestamps: true });

export default mongoose.model("Follow", FollowSchema);