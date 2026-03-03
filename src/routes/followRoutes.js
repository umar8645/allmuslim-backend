// src/routes/followRoutes.js
import { Router } from "express";
import { follow } from "../controllers/followController.js";
const r = Router();
r.post("/", follow);
export default r;