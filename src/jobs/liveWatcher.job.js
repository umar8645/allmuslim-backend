// src/jobs/liveWatcher.job.js
import Content from "../models/Content.js";
import DownloadJob from "../models/DownloadJob.js";

export async function watchLives() {
  const lives = await Content.find({ isLive: true });

  for (const live of lives) {
    if (live.liveEnded) {
      await DownloadJob.updateMany(
        { contentId: live._id, status: "waiting" },
        { status: "processing" }
      );

      live.isLive = false;
      await live.save();
    }
  }
}