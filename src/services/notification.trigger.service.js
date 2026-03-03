// src/services/notification.trigger.service.js
import Follow from "../models/Follow.js";
import { sendFCM } from "../utils/fcm.js";

export async function notifyFollowers(content) {
  const followers = await Follow.find({
    channelId: content.channelId,
  });

  for (const f of followers) {
    await sendFCM({
      topic: `user_${f.userId}`,
      title: `New from ${content.speaker}`,
      body: content.title,
      data: { contentId: content._id },
    });
  }
}