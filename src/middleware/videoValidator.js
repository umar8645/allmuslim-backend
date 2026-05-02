import path from "path";

export const videoValidator = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No video uploaded" });
  }

  const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
  const maxSize = 200 * 1024 * 1024; // 200MB

  // ✅ Check file type
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ success: false, message: "Invalid video format" });
  }

  // ✅ Check file size
  if (req.file.size > maxSize) {
    return res.status(400).json({ success: false, message: "Video too large (max 200MB)" });
  }

  // ✅ Optional: check extension
  const ext = path.extname(req.file.originalname).toLowerCase();
  if (![".mp4", ".webm", ".ogg"].includes(ext)) {
    return res.status(400).json({ success: false, message: "Unsupported file extension" });
  }

  next();
};
