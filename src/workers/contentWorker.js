import { Worker } from "bullmq";
import redis from "../config/redis.js";

const worker = new Worker(
  "scrapeQueue",
  async job => {
    console.log("Processing job:", job.id);

    // saka main logic naka anan
    return { success: true };
  },
  {
    connection: redis,
    concurrency: 5
  }
);

worker.on("completed", job => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});