// src/workers/download.worker.js
import { Worker } from "bullmq";
import { redis } from "../queue/redis.js";
import DownloadJob from "../models/DownloadJob.js";

new Worker(
  "downloads",
  async (job) => {
    const { userId, contentId, format } = job.data;

    const dbJob = await DownloadJob.findOneAndUpdate(
      { userId, contentId, format },
      { status: "processing" }
    );

    // 🔧 nan zaka saka yt-dlp / ffmpeg
    const fileUrl = `/downloads/${dbJob._id}.${format}`;

    await DownloadJob.updateOne(
      { _id: dbJob._id },
      { status: "ready", fileUrl }
    );

    return true;
  },
  {
    connection: redis,
    concurrency: 2 // 👈 mahimmanci
  }
);