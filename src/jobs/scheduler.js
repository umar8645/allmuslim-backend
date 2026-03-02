import cron from "node-cron";
import { updateRSSFeeds } from "../services/rssService.js";
import { fetchLatestVideos } from "../services/youtubeService.js";
import { fetchExternalWaazi } from "../services/waaziApiService.js";
import { sendFCM } from "../utils/fcm.js"; // FCM helper

export const startScheduler = () => {
  console.log("✅ Scheduler started");

  cron.schedule("*/5 * * * *", async () => {
    console.log("⏳ Running scheduled jobs...");

    // parallel jobs
    const results = await Promise.allSettled([
      updateRSSFeeds(),
      fetchLatestVideos(),
      fetchExternalWaazi()
    ]);

    // ====== Auto-push notifications ======
    // RSS
    if (results[0].status === "fulfilled") {
      const newRSS = results[0].value; // updateRSSFeeds zai dawo da sabon items
      newRSS?.forEach(item => {
        sendFCM({
          topic: "rss",
          title: `New RSS: ${item.title}`,
          body: item.speaker || "AllMuslim",
          data: { url: item.sourceUrl }
        });
      });
    }

    // YouTube
    if (results[1].status === "fulfilled") {
      const newVideos = results[1].value; // fetchLatestVideos zai dawo da sabon videos
      newVideos?.forEach(video => {
        sendFCM({
          topic: "videos",
          title: `New Video: ${video.title}`,
          body: video.speaker || "AllMuslim",
          data: { videoId: video.videoId }
        });
      });
    }

    console.log("✅ Jobs finished");
  });
};