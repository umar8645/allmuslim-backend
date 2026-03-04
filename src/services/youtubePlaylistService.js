import axios from "axios";

export async function addToPlaylist(playlistId, videoId) {
  if (!playlistId) return;

  try {
    await axios.post(
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
      {
        snippet: {
          playlistId,
          resourceId: {
            kind: "youtube#video",
            videoId
          }
        }
      },
      {
        params: { key: process.env.YOUTUBE_API_KEYS.split(",")[0] }
      }
    );
  } catch {
    // silent fail
  }
}