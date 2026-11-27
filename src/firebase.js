import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "global-otp-c538a.firebaseapp.com",
  projectId: "global-otp-c538a",
  storageBucket: "global-otp-c538a.firebasestorage.app",
  messagingSenderId: "56557169051",
  appId: "1:56557169051:web:7c6f330808bdee849f193e",
  measurementId: "G-27BKNP NLRH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
