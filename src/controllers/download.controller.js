// src/controllers/download.controller.js
import { downloadQueue } from "../queue/download.queue.js";

export async function requestDownload(req, res) {
  const { contentId, format } = req.body;

  const job = await downloadQueue.add("download", {
    userId: req.user.id,
    contentId,
    format
  });

  res.json({
    message: "Download ya shiga layi",
    jobId: job.id
  });
}