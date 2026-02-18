import cron from "node-cron";
import { contentQueue } from "../queues/contentQueue.js";

export const startScheduler = () => {
  cron.schedule("*/10 * * * *", async () => {
    try {
      await contentQueue.add("rss");
      await contentQueue.add("youtube");
      await contentQueue.add("waazi");
      console.log("🔄 Content jobs added to queue");
    } catch (error) {
      console.error("Scheduler error:", error.message);
    }
  });

  console.log("✅ Scheduler running");
};