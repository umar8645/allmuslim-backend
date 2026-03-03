// src/jobs/downloadProcessor.job.js
import DownloadJob from "../models/DownloadJob.js";

export async function processDownloads() {
  const jobs = await DownloadJob.find({ status: "processing" });

  for (const job of jobs) {
    try {
      // nan zaka saka ffmpeg / yt-dlp
      job.fileUrl = `/downloads/${job._id}.${job.format}`;
      job.status = "ready";
      await job.save();
    } catch {
      job.status = "failed";
      await job.save();
    }
  }
}