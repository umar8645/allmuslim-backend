import Redis from "ioredis";

let redis = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  redis.on("connect", () => console.log("✅ Redis connected"));
  redis.on("error", (err) =>
    console.error("❌ Redis error:", err.message)
  );
} else {
  console.log("⚠️ REDIS_URL not set — Redis disabled");
}

export default redis;