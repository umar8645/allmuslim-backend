import { Worker } from "bullmq";
import redis from "../config/redis.js";

import { updateRSSFeeds } from "../services/rssService.js";
import { fetchLatestVideos } from "../services/youtubeService.js";
import { fetchExternalWaazi } from "../services/waaziApiService.js";

const worker = new Worker(
  "contentQueue",
  async (job) => {
    if (job.name === "rss") {
      await updateRSSFeeds();
    }

    if (job.name === "youtube") {
      await fetchLatestVideos();
    }

    if (job.name === "waazi") {
      await fetchExternalWaazi();
    }
  },
  { connection: redis }
);

worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.name}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job failed: ${job.name}`, err);
});