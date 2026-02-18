import cron from "node-cron";
import { scrapeQueue } from "../queues/scrapeQueue.js";

export const startScheduler = () => {
  if (!scrapeQueue) {
    console.log("⚠️ Scheduler not started — Queue not available");
    return;
  }

  // Run every 30 minutes
  cron.schedule("*/30 * * * *", async () => {
    try {
      await scrapeQueue.add("update-content", {}, {
        // Production-safe options
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000
        },
        removeOnComplete: 50,
        removeOnFail: 20
      });

      console.log("📥 Job added to scrapeQueue");
    } catch (error) {
      console.error("❌ Failed to add job to queue:", error.message);
    }
  });

  console.log("✅ Scheduler Running with BullMQ (every 30 mins)");
};