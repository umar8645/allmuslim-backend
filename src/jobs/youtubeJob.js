import { fetchPlaylistItems } from "../services/youtube.service.js";
import Content from "../models/Content.js";

const MAX_ITEMS = Number(process.env.MAX_ITEMS_PER_RUN || 20);

export async function runYouTubeJob() {
  const playlists = process.env.YOUTUBE_PLAYLIST_IDS.split(",");

  for (const playlistId of playlists) {
    const videos = await fetchPlaylistItems(playlistId, MAX_ITEMS);

    for (const v of videos) {
      if (!/islam|quran|hadith|tafsir|waazi|khutbah/i.test(v.title)) continue;

      await Content.updateOne(
        { sourceId: v.videoId },
        { $setOnInsert: v },
        { upsert: true }
      );
    }
  }
}