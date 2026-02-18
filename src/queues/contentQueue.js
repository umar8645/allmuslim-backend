import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const scrapeQueue = new Queue("scrapeQueue", {
  connection,
  defaultJobOptions: {
    removeOnComplete: 50,   // keep last 50 success jobs
    removeOnFail: 20,       // keep last 20 failed jobs
    attempts: 3,            // retry 3 times if failed
    backoff: {
      type: "exponential",
      delay: 5000,          // 5 seconds delay
    },
  },
});