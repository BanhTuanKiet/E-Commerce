const { initializeApp } = require("firebase/app")
const { getAuth } = require("firebase/auth")

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.APP_ID
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

module.exports = auth