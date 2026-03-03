// src/controllers/download.controller.js
import { checkDailyQuota } from "../services/quota.service.js";
import DownloadJob from "../models/DownloadJob.js";
import Content from "../models/Content.js";

export async function requestDownload(req, res) {
  const { contentId, format } = req.body;

  if (!(await checkDailyQuota(req.user.id))) {
    return res.status(429).json({
      error: "Daily download limit ya cika"
    });
  }

  const exists = await DownloadJob.findOne({
    userId: req.user.id,
    contentId,
    format,
    status: { $in: ["waiting", "processing", "ready"] }
  });

  if (exists) {
    return res.json({
      message: "Download yana aiki ko ya riga ya shirya",
      jobId: exists._id
    });
  }

  const content = await Content.findById(contentId);

  const job = await DownloadJob.create({
    userId: req.user.id,
    contentId,
    format,
    status: content.isLive ? "waiting" : "processing"
  });

  res.json({ jobId: job._id });
}