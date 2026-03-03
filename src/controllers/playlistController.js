// src/controllers/playlistController.js
import Playlist from "../models/Playlist.js";

export async function getPlaylists(req, res) {
  const lists = await Playlist.find().populate("items").limit(50);
  res.json(lists);
}