import cron from "node-cron";
import { contentQueue } from "../queues/contentQueue.js";

export const startScheduler = () => {
  cron.schedule("*/30 * * * *", async () => {
    await contentQueue.add("update-content", {}, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000
      },
      removeOnComplete: true,
      removeOnFail: false
    });

    console.log("📥 Job added to queue");
  });

  console.log("✅ Scheduler Running with BullMQ");
};