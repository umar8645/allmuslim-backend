import express from "express";
import multer from "multer";
import { getLiveLectures, uploadLiveLecture, deleteLiveLecture } from "../controllers/liveController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { videoValidator } from "../middleware/videoValidator.js";

const router = express.Router();

// ✅ Multer setup for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ✅ Routes
router.get("/", getLiveLectures);
router.post(
  "/upload",
  authMiddleware(["admin"]),
  upload.single("video"),
  videoValidator,   // 🔥 Validation middleware
  uploadLiveLecture
);
router.delete("/:id", authMiddleware(["admin"]), deleteLiveLecture);

export default router;
