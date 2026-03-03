// src/services/follow.service.js
import Follow from "../models/Follow.js";
import Playlist from "../models/Playlist.js";
import Notification from "../models/Notification.js";

export async function onNewContent(content) {
  const followers = await Follow.find({ scholarId: content.scholarId });

  for (const f of followers) {
    // auto-playlist
    await Playlist.updateOne(
      { userId: f.userId, name: "Following" },
      { $push: { items: { contentId: content._id, addedAt: new Date() } } },
      { upsert: true }
    );

    // notification
    await Notification.create({
      userId: f.userId,
      title: "Sabon wa’azi",
      body: content.title
    });
  }
}