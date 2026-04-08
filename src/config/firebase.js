import admin from "firebase-admin";

let serviceAccount = null;

// ✅ Duba idan FIREBASE_SERVICE_ACCOUNT ya kasance a .env
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.error("❌ Error parsing FIREBASE_SERVICE_ACCOUNT:", error.message);
  }
}

if (serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Initialized with service account");
  } catch (error) {
    console.error("❌ Firebase initialization error:", error.message);
  }
} else {
  console.log("⚠ Firebase service account not found. Please check your .env file.");
}

// ✅ Event listeners don debugging
admin.app().options && console.log("📡 Firebase app options loaded");

export default admin;
