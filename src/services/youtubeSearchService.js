import axios from "axios";

const apiKeys = (process.env.YOUTUBE_API_KEYS || "").split(",").filter(Boolean);
let keyIndex = 0;

function getKey() {
  return apiKeys[keyIndex];
}
function rotateKey() {
  keyIndex = (keyIndex + 1) % apiKeys.length;
}

export async function searchYouTube({ q, maxResults = 10 }) {
  let attempts = 0;

  while (attempts < apiKeys.length) {
    try {
      const res = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            q,
            type: "video",
            order: "date",
            safeSearch: "strict",
            maxResults,
            key: getKey()
          },
          timeout: 15000
        }
      );

      return res.data.items || [];
    } catch (err) {
      if ([400, 403, 429].includes(err.response?.status)) {
        rotateKey();
        attempts++;
        continue;
      }
      return [];
    }
  }
  return [];
}