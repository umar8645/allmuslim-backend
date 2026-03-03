// src/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  deviceToken: String,
  country: String,
  language: String,
}, { timestamps: true });

export default mongoose.model("User", UserSchema);