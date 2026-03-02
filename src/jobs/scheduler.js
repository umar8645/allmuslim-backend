import cron from "node-cron";
import { updateRSSFeeds } from "../services/rssService.js";
import { fetchLatestVideos } from "../services/youtubeService.js";
import { fetchExternalWaazi } from "../services/waaziApiService.js";
import { sendFCM } from "../utils/fcm.js";
import LibraryItem from "../models/LibraryItem.js";
import Notification from "../models/Notification.js";

const autoPopulateLibrary = async (rssItems, videos, waaziItems) => {
  // RSS → Library + Notifications
  for (const item of rssItems || []) {
    await LibraryItem.updateOne(
      { sourceUrl: item.sourceUrl },
      {
        title: item.title,
        speaker: item.speaker || "Unknown",
        publishedAt: item.dateTime || new Date(),
        sourceUrl: item.sourceUrl
      },
      { upsert: true }
    );

    await Notification.updateOne(
      { message: `New RSS: ${item.title}` },
      { message: `New RSS: ${item.title}` },
      { upsert: true }
    );
  }

  // Videos → Library + Notifications
  for (const video of videos || []) {
    await LibraryItem.updateOne(
      { sourceUrl: `https://youtube.com/watch?v=${video.videoId}` },
      {
        title: video.title,
        speaker: video.speaker || "Unknown",
        publishedAt: video.publishedAt || new Date(),
        sourceUrl: `https://youtube.com/watch?v=${video.videoId}`
      },
      { upsert: true }
    );

    await Notification.updateOne(
      { message: `New Video: ${video.title}` },
      { message: `New Video: ${video.title}` },
      { upsert: true }
    );
  }

  // Waazi → Notifications (Library ba zai iya cika ba saboda Waazi content unique)
  for (const waazi of waaziItems || []) {
    await Notification.updateOne(
      { message: `New Waazi: ${waazi.title}` },
      { message: `New Waazi: ${waazi.title}` },
      { upsert: true }
    );
  }
};

export const startScheduler = () => {
  console.log("✅ Scheduler started");

  cron.schedule("*/5 * * * *", async () => {
    console.log("⏳ Running scheduled jobs...");

    const results = await Promise.allSettled([
      updateRSSFeeds(),
      fetchLatestVideos(),
      fetchExternalWaazi()
    ]);

    const newRSS = results[0].status === "fulfilled" ? results[0].value : [];
    const newVideos = results[1].status === "fulfilled" ? results[1].value : [];
    const newWaazi = results[2].status === "fulfilled" ? results[2].value : [];

    // Auto-populate Library + Notifications
    await autoPopulateLibrary(newRSS, newVideos, newWaazi);

    // Auto-push notifications via FCM
    for (const item of newRSS) {
      sendFCM({
        topic: "rss",
        title: `New RSS: ${item.title}`,
        body: item.speaker || "AllMuslim",
        data: { url: item.sourceUrl }
      });
    }
    for (const video of newVideos) {
      sendFCM({
        topic: "videos",
        title: `New Video: ${video.title}`,
        body: video.speaker || "AllMuslim",
        data: { videoId: video.videoId }
      });
    }

    console.log("✅ Jobs finished");
  });
};