import { Queue } from "bullmq";

let contentQueue = null;

if (process.env.REDIS_URL) {
  const connection = {
    url: process.env.REDIS_URL,
    ...(process.env.REDIS_URL.startsWith("rediss://")
      ? { tls: {} }
      : {})
  };

  contentQueue = new Queue("contentQueue", { connection });

  console.log("✅ BullMQ Queue initialized");
} else {
  console.log("⚠️ REDIS_URL not set — Queue disabled");
}

export { contentQueue };