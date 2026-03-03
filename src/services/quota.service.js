// src/services/quota.service.js
import DownloadJob from "../models/DownloadJob.js";

export async function checkDailyQuota(userId) {
  const today = new Date();
  today.setHours(0,0,0,0);

  const count = await DownloadJob.countDocuments({
    userId,
    createdAt: { $gte: today }
  });

  return count < 10; // max 10/day
}