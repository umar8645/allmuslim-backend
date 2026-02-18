import Redis from "ioredis";

let redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    tls: process.env.REDIS_URL.startsWith("rediss://")
      ? {}
      : undefined,
  });
} else {
  console.warn("⚠️ REDIS_URL not found. Using localhost.");
  redis = new Redis({
    host: "127.0.0.1",
    port: 6379,
  });
}

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));

export default redis;