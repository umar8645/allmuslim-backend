import admin from "../config/firebase.js";

export const sendNotification = async (title, body, topic = "all", target = "main") => {
  const message = {
    notification: { title, body },
    data: { target }, // 👈 pass target activity
    topic
  };

  try {
    await admin.messaging().send(message);
    console.log(`✅ Notification sent to topic: ${topic}, target: ${target}`);
  } catch (error) {
    console.error("❌ Notification error:", error.message);
  }
};
