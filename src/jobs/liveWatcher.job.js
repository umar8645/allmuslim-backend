// src/jobs/liveWatcher.job.js
import Content from "../models/Content.js";
import DownloadJob from "../models/DownloadJob.js";
import { downloadQueue } from "../queue/download.queue.js"; // import queue

export async function watchLives() {
  const lives = await Content.find({ isLive: true });

  for (const live of lives) {
    if (live.liveEnded) {
      // Sabunta duk jobs da ke jira zuwa "processing"
      const jobs = await DownloadJob.find({
        contentId: live._id,
        status: "waiting"
      });

      for (const job of jobs) {
        job.status = "processing";
        await job.save();

        // Ƙara job a cikin downloadQueue
        await downloadQueue.add("download", {
          userId: job.userId,
          contentId: job.contentId,
          format: job.format
        });
      }

      // Sabunta content
      live.isLive = false;
      await live.save();
    }
  }
}
