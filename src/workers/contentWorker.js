import { Worker } from "bullmq";

const connection = {
  url: process.env.REDIS_URL,
  ...(process.env.REDIS_URL?.startsWith("rediss://")
    ? { tls: {} }
    : {})
};

const worker = new Worker(
  "contentQueue",
  async (job) => {
    if (job.name === "rss") {
      await updateRSSFeeds();
    }

    if (job.name === "youtube") {
      await fetchLatestVideos();
    }

    if (job.name === "waazi") {
      await fetchExternalWaazi();
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.name}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job failed: ${job?.name}`, err);
});