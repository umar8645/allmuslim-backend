import cron from "node-cron";
import { runDiscoveryJob } from "../jobs/discovery.v2.job.js";
import { runCleanupJob } from "../jobs/cleanup.job.js";
import { runTrustScoreJob } from "../jobs/trustScore.job.js";

export function startScheduler() {
  console.log("🟢 Scheduler Started");

  // 🔍 Discovery Job – every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    try {
      console.log("🚀 Running Discovery Job...");
      await runDiscoveryJob();
    } catch (err) {
      console.error("❌ Discovery Job Failed:", err.message);
    }
  });

  // 🧹 Cleanup Job – every day at 2 AM
  cron.schedule("0 2 * * *", async () => {
    try {
      console.log("🧹 Running Cleanup Job...");
      await runCleanupJob();
    } catch (err) {
      console.error("❌ Cleanup Job Failed:", err.message);
    }
  });

  // ⭐ Trust Score Job – every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    try {
      console.log("⭐ Updating Trust Scores...");
      await runTrustScoreJob();
    } catch (err) {
      console.error("❌ Trust Score Job Failed:", err.message);
    }
  });
}