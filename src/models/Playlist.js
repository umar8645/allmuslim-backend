// src/models/Playlist.js
import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  items: [{
    contentId: mongoose.Schema.Types.ObjectId,
    addedAt: Date
  }]
});

export default mongoose.model("Playlist", PlaylistSchema);