// src/services/playlist.service.js
import Playlist from "../models/Playlist.js";

export async function addToPlaylist({ contentId, speaker, language, topics }) {

  // speaker playlist
  await Playlist.updateOne(
    { type: "speaker", key: speaker },
    {
      title: `Wa'azi by ${speaker}`,
      $addToSet: { items: contentId },
    },
    { upsert: true }
  );

  // language playlist
  await Playlist.updateOne(
    { type: "language", key: language },
    {
      title: `${language.toUpperCase()} Lectures`,
      $addToSet: { items: contentId },
    },
    { upsert: true }
  );

  // topics
  for (const topic of topics || []) {
    await Playlist.updateOne(
      { type: "topic", key: topic },
      {
        title: `${topic} Wa'azi`,
        $addToSet: { items: contentId },
      },
      { upsert: true }
    );
  }
}