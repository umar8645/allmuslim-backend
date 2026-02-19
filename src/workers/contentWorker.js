import { Worker } from "bullmq";
import redis from "../config/redis.js";

import { updateYouTube } from "../services/youtubeService.js";
import { updateRSSFeeds } from "../services/rssService.js";
import { fetchExternalWaazi } from "../services/waaziService.js";

const worker = new Worker(
  "scrapeQueue",
  async job => {
    console.log("🚀 Processing job:", job.id);

    // AUTO SCRAPING LOGIC
    await updateYouTube();
    await updateRSSFeeds();
    await fetchExternalWaazi();

    console.log("✅ Scraping completed");

    return { success: true };
  },
  {
    connection: redis,
    concurrency: 3
  }
);

worker.on("completed", job => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});