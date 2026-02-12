import cron from "node-cron";
import { updateRSSFeeds } from "../services/rssService.js";
import { fetchLatestVideos } from "../services/youtubeService.js";
import { fetchExternalWaazi } from "../services/waaziApiService.js";

export const startScheduler = () => {
  console.log("✅ Scheduler started");

  // Run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    console.log("🕒 Running scheduled jobs...");

    await updateRSSFeeds();
    await fetchLatestVideos();
    await fetchExternalWaazi();

    console.log("✅ Scheduled jobs finished");
  });
};