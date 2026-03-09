import admin from "firebase-admin"
import fs from "fs"
import path from "path"

let serviceAccount = null

try {
  const filePath = path.resolve("src/firebase-service-account.json")

  if (fs.existsSync(filePath)) {
    serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"))

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  } else {
    console.log("⚠ firebase-service-account.json not found, Firebase disabled")
  }
} catch (error) {
  console.log("Firebase init error:", error.message)
}

export default admin