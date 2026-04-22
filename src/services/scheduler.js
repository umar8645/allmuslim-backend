import cron from "node-cron";
import { fetchRSSLectures } from "./rssCrawler.js";
import { fetchYouTubeLectures } from "./youtubeCrawler.js";

// Run RSS crawler every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("⏰ Running RSS crawler...");
  await fetchRSSLectures();
});

// Run YouTube crawler every 12 hours
cron.schedule("0 */12 * * *", async () => {
  console.log("⏰ Running YouTube crawler...");
  await fetchYouTubeLectures();
});

console.log("✅ Scheduler initialized");
