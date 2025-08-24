import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyC_s2ZorZo6oTEy1rFJ2I02BKeL7C5Ejyo",
  authDomain: "e-commerce-8eeb6.firebaseapp.com",
  projectId: "e-commerce-8eeb6",
  storageBucket: "e-commerce-8eeb6.appspot.com",
  messagingSenderId: "673333880916",
  appId: "1:673333880916:web:xxxxxx"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider(app)
export const facebookProvider = new FacebookAuthProvider(app)