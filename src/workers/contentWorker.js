import { Worker } from "bullmq";
import redis from "../config/redis.js";

import { updateYouTube } from "../services/youtubeService.js";
import { updateRSSFeeds } from "../services/rssService.js";
import { fetchExternalWaazi } from "../services/waaziApiService.js"; // ✅ FIXED HERE

const worker = new Worker(
  "scrapeQueue",
  async (job) => {
    console.log("🚀 Processing job:", job.id);

    try {
      // YouTube
      console.log("▶ Updating YouTube...");
      await updateYouTube();

      // RSS
      console.log("📰 Updating RSS Feeds...");
      await updateRSSFeeds();

      // Waazi
      console.log("🎙 Updating External Waazi...");
      await fetchExternalWaazi();

      console.log("✅ Scraping completed successfully");
      return { success: true };

    } catch (error) {
      console.error("❌ Scraping error:", error.message);
      throw error; // BullMQ zai mark job as failed
    }
  },
  {
    connection: redis,
    concurrency: 3,
  }
);

/* EVENTS */
worker.on("ready", () => {
  console.log("👷 Worker is ready");
});

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});

worker.on("error", (err) => {
  console.error("🚨 Worker error:", err);
});

export default worker;