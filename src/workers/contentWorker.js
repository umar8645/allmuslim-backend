import { Worker } from "bullmq";
import { updateRSSFeeds } from "../services/rssService.js";
import { updateYouTube } from "../services/youtubeService.js";

if (process.env.REDIS_URL) {
  const connection = {
    url: process.env.REDIS_URL,
    ...(process.env.REDIS_URL.startsWith("rediss://")
      ? { tls: {} }
      : {})
  };

  const worker = new Worker(
    "contentQueue",
    async (job) => {
      console.log("🔄 Processing job:", job.name);

      if (job.name === "update-content") {
        await updateRSSFeeds();
        await updateYouTube();
      }
    },
    {
      connection,
      concurrency: 2
    }
  );

  worker.on("completed", (job) => {
    console.log("✅ Job completed:", job.name);
  });

  worker.on("failed", (job, err) => {
    console.error("❌ Job failed:", job?.name, err.message);
  });

  console.log("✅ Worker started");
} else {
  console.log("⚠️ Worker disabled (no Redis)");
}