import cron from "node-cron";

import { runDiscoveryJob } from "./discovery.v2.job.js";
import { runCleanupJob } from "./cleanup.job.js";
import { runTrustScoreJob } from "./trustScore.job.js";

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

  /**
   * 🔍 Discovery Job
   * Every 30 minutes
   */
  cron.schedule("*/30 * * * *", async () => {
    try {
      console.log("🚀 Discovery Job started");
      await runDiscoveryJob();
      console.log("✅ Discovery Job done");
    } catch (err) {
      console.error("❌ Discovery Job Failed:", err.message);
    }
  });

  /**
   * 🧹 Cleanup Job
   * Daily at 02:00 AM
   */
  cron.schedule("0 2 * * *", async () => {
    try {
      console.log("🧹 Cleanup Job started");
      await runCleanupJob();
      console.log("✅ Cleanup Job done");
    } catch (err) {
      console.error("❌ Cleanup Job Failed:", err.message);
    }
  });

  /**
   * ⭐ Trust Score Job
   * Every 6 hours
   */
  cron.schedule("0 */6 * * *", async () => {
    try {
      console.log("⭐ Trust Score Job started");
      await runTrustScoreJob();
      console.log("✅ Trust Score Job updated");
    } catch (err) {
      console.error("❌ Trust Score Job Failed:", err.message);
    }
  });
}

export function getSchedulerStatus() {
  return schedulerStatus;
}