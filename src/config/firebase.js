import admin from "firebase-admin"

let serviceAccount = null

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
}

if (serviceAccount) {

admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
})

console.log("✅ Firebase Initialized")

} else {

console.log("⚠ Firebase service account not found")

}

export default admin
