import admin from "firebase-admin";

export async function sendFCM(message) {
  if (!message.topic) return;

  await admin.messaging().send({
    topic: message.topic,
    notification: {
      title: message.title,
      body: message.body
    },
    data: Object.fromEntries(
      Object.entries(message.data || {}).map(([k, v]) => [k, String(v)])
    )
  });
}
