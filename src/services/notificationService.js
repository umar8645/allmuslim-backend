import admin from "firebase-admin"

export const sendNotification = async (title, body) => {

  const message = {
    notification: {
      title: title,
      body: body
    },
    topic: "all"
  }

  try {

    await admin.messaging().send(message)

    console.log("Notification sent")

  } catch (error) {

    console.error(error)

  }

}