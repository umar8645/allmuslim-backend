// services/scheduler.js
import cron from "node-cron";
import { fetchRSSLectures } from "./rssCrawler.js";
import { fetchYouTubeLectures } from "./youtubeCrawler.js";

// ✅ RSS crawler: gudana duk bayan awa 1
cron.schedule("0 */1 * * *", async () => {
  try {
    console.log("⏰ Running RSS crawler...");
    await fetchRSSLectures();
    console.log("✅ RSS crawler finished");
  } catch (error) {
    console.error("❌ RSS crawler error:", error.message);
  }
});

// ✅ YouTube crawler: gudana duk bayan awa 2
cron.schedule("0 */2 * * *", async () => {
  try {
    console.log("⏰ Running YouTube crawler...");
    await fetchYouTubeLectures();
    console.log("✅ YouTube crawler finished");
  } catch (error) {
    console.error("❌ YouTube crawler error:", error.message);
  }
});

console.log("✅ Scheduler initialized");
