// src/models/UserPreference.js
import mongoose from "mongoose";

const UserPreferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, index: true },

  languages: [String],        // ["ha", "en", "ar"]
  countries: [String],        // ["NG"]
  topics: [String],           // ["tafsir", "aqeeda"]

  followedScholars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scholar"
  }],

  activity: {
    watched: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    lastActiveAt: Date
  }
}, { timestamps: true });

export default mongoose.model("UserPreference", UserPreferenceSchema);