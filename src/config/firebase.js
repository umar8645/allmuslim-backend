import admin from "firebase-admin"

let serviceAccount = null

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  }
} catch (err) {
  console.error("❌ Invalid Firebase JSON")
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
  console.log("✅ Firebase Initialized")
} else {
  console.log("⚠ Firebase not configured")
}

export default admin