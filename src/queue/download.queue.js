// src/queue/download.queue.js
import { Queue } from "bullmq";
import { redis } from "./redis.js";

export const downloadQueue = new Queue("downloads", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 60_000 // 1 min
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});