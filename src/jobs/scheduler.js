import cron from "node-cron";
import { updateRSSFeeds } from "../services/rssService.js";
import { fetchLatestVideos } from "../services/youtubeService.js";
import { fetchExternalWaazi } from "../services/waaziApiService.js";

export const startScheduler = () => {

  console.log("✅ Scheduler started");

  // run every 2 minutes
  cron.schedule("*/2 * * * *", async () => {

    try {

      console.log("⏳ Running scheduled jobs...");

      await updateRSSFeeds();

      await fetchLatestVideos();

      await fetchExternalWaazi();

      console.log("✅ Scheduled jobs finished");

    } catch (err) {

      console.error("❌ Scheduler error:", err.message);

    }

  });

};