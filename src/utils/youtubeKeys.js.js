// src/utils/youtubeKeys.js

let apiKeys = [];
let currentIndex = 0;

/**
 * Load API keys from ENV safely
 */
function loadKeys() {
  const raw = process.env.YOUTUBE_API_KEYS;

  if (!raw) {
    console.warn("⚠️ YOUTUBE_API_KEYS not set in environment");
    apiKeys = [];
    return;
  }

  apiKeys = raw
    .split(",")
    .map((key) => key.trim())
    .filter((key) => key.length > 0);

  if (!apiKeys.length) {
    console.warn("⚠️ No valid YouTube API keys found");
  }
}

loadKeys();

/**
 * Get current API key
 */
export function getApiKey() {
  if (!apiKeys.length) {
    console.warn("⚠️ No YouTube API keys available");
    return null;
  }

  return apiKeys[currentIndex];
}

/**
 * Rotate API key (for quota exceeded)
 */
export function rotateKey() {
  if (!apiKeys.length) return;

  currentIndex = (currentIndex + 1) % apiKeys.length;
  console.log("🔄 Rotated YouTube API key");
}