import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(process.env.REDIS_URL);

// Main queue for lecture processing
export const lectureQueue = new Queue("lecture-processing", { connection });

// Example: add job
export const addLectureJob = async (lectureData) => {
  await lectureQueue.add("processLecture", lectureData, {
    attempts: 3, // retry up to 3 times
    backoff: { type: "exponential", delay: 5000 } // retry after 5s, 10s, 20s...
  });
};
