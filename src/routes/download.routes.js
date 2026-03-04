import express from "express";
import { auth } from "../middleware/auth.js";
import { downloadLimiter } from "../middleware/downloadRateLimit.js";
import { requestDownload } from "../controllers/downloadController.js";

const router = express.Router();

router.post(
  "/request",
  auth,
  downloadLimiter,
  requestDownload
);

export default router;