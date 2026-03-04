import cron from "node-cron";

import { runDiscoveryJob } from "./discovery.v2.job.js";
import { runCleanupJob } from "./cleanup.job.js";
import { runTrustScoreJob } from "./trustScore.job.js";
import { rssJob } from "./rss.job.js";
import { runYouTubeDiscovery } from "./youtubeDiscoveryJob.js";

let schedulerStatus = "idle";
let started = false;

export function startScheduler() {
  if (started) {
    console.log("⚠️ Scheduler already running – skipped");
    return;
  }

  started = true;
  schedulerStatus = "active";
  console.log("🟢 Scheduler Started");

  // 🔎 DISCOVERY (Every 1 minute)
  cron.schedule("*/1 * * * *", async () => {
    try {
      console.log("🚀 Discovery Job started");
      await runDiscoveryJob();
      console.log("✅ Discovery Job done");
    } catch (err) {
      console.error("❌ Discovery Job Failed:", err.message);
    }
  });

  // 📡 RSS JOB (Every 5 minutes)
  cron.schedule("*/5 * * * *", async () => {
    try {
      console.log("📡 RSS Job started");
      await rssJob();
      console.log("✅ RSS Job done");
    } catch (err) {
      console.error("❌ RSS Job Failed:", err.message);
    }
  });

  // 🎥 YOUTUBE DISCOVERY (Every 10 minutes)
  cron.schedule("*/10 * * * *", async () => {
    try {
      console.log("🎥 YouTube Discovery started");
      await runYouTubeDiscovery();
      console.log("✅ YouTube Discovery done");
    } catch (err) {
      console.error("❌ YouTube Discovery Failed:", err.message);
    }
  });

  // 🧹 Cleanup Daily at 2 AM
  cron.schedule("0 2 * * *", async () => {
    await runCleanupJob();
  });

  // ⭐ Trust Score Every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    await runTrustScoreJob();
  });
}

export function getSchedulerStatus() {
  return schedulerStatus;
}
