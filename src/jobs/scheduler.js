import cron from "node-cron";
import { contentQueue } from "../queues/contentQueue.js";

export const startScheduler = () => {
  cron.schedule("*/10 * * * *", async () => {
    await contentQueue.add("rss");
    await contentQueue.add("youtube");
    await contentQueue.add("waazi");
  });

  console.log("✅ Scheduler running");
};