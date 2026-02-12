import cron from "node-cron";
import { updateRSSFeeds } from "../services/rssService.js";
import { fetchLatestVideos } from "../services/youtubeService.js";
import { fetchExternalWaazi } from "../services/waaziApiService.js";

export const startScheduler = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("Running scheduled jobs...");

    await updateRSSFeeds();
    await fetchLatestVideos();
    await fetchExternalWaazi();

    console.log("Scheduled jobs finished");
  });
};
