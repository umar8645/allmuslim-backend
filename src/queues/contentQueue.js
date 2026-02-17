import { Queue } from "bullmq";
import redis from "../config/redis.js";

export const contentQueue = new Queue("contentQueue", {
  connection: redis,
});