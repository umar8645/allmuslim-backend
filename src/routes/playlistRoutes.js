// src/routes/playlistRoutes.js
import { Router } from "express";
import { getPlaylists } from "../controllers/playlistController.js";
const r = Router();
r.get("/", getPlaylists);
export default r;