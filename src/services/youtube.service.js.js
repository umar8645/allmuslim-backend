import axios from "axios";

const KEYS = process.env.YOUTUBE_API_KEYS.split(",");
let keyIndex = 0;

function nextKey() {
  keyIndex = (keyIndex + 1) % KEYS.length;
  return KEYS[keyIndex];
}

export async function searchYouTube(query, max = 10) {
  try {
    const key = KEYS[keyIndex];
    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key,
          q: query,
          part: "snippet",
          maxResults: max,
          type: "video",
          safeSearch: "strict",
        },
      }
    );
    return res.data.items || [];
  } catch (e) {
    nextKey();
    return [];
  }
}