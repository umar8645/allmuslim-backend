import cron from "node-cron";
import { updateRSSFeeds } from "../services/rssService.js";
import { fetchLatestVideos } from "../services/youtubeService.js";
import { fetchExternalWaazi } from "../services/waaziApiService.js";

export const startScheduler = () => {
  console.log("✅ Scheduler started");

  cron.schedule("*/5 * * * *", async () => {
    console.log("⏳ Running scheduled jobs...");
    await Promise.allSettled([
      updateRSSFeeds(),
      fetchLatestVideos(),
      fetchExternalWaazi()
    ]);
    console.log("✅ Jobs finished");
  });
};