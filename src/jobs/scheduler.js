import cron from "node-cron";
import { contentQueue } from "../queues/contentQueue.js";

export const startScheduler = () => {
  // Idan queue babu (Redis not configured)
  if (!contentQueue) {
    console.log("⚠️ Scheduler not started — Queue not available");
    return;
  }

  cron.schedule("*/30 * * * *", async () => {
    try {
      await contentQueue.add(
        "update-content",
        {},
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000
          },
          removeOnComplete: true,
          removeOnFail: false
        }
      );

      console.log("📥 Job added to queue");
    } catch (error) {
      console.error("❌ Failed to add job to queue:", error.message);
    }
  });

  console.log("✅ Scheduler Running with BullMQ");
};