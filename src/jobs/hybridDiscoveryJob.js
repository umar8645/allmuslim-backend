import { updateRSSFeeds } from "../services/rssService.js";
import { runYouTubeDiscovery } from "./youtubeDiscoveryJob.js";

export async function runHybridDiscovery() {
  await Promise.allSettled([
    updateRSSFeeds(),
    runYouTubeDiscovery()
  ]);
}