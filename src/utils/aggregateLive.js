let apiKeys = process.env.YOUTUBE_API_KEYS
  ? process.env.YOUTUBE_API_KEYS.split(",")
  : [];

let currentIndex = 0;

export function getApiKey() {
  if (!apiKeys.length) {
    console.warn("⚠️ No YouTube API keys found");
    return null;
  }
  return apiKeys[currentIndex];
}

export function rotateKey() {
  if (!apiKeys.length) return;
  currentIndex = (currentIndex + 1) % apiKeys.length;
}