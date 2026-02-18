import { Queue } from "bullmq";

const connection = {
  url: process.env.REDIS_URL,
  ...(process.env.REDIS_URL?.startsWith("rediss://")
    ? { tls: {} }
    : {})
};

export const contentQueue = new Queue("contentQueue", {
  connection
});