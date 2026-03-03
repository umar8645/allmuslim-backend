// src/routes/download.routes.js
import { auth } from "../middleware/auth.js";
import { downloadLimiter } from "../middleware/downloadRateLimit.js";

router.post(
  "/request",
  auth,
  downloadLimiter,
  requestDownload
);