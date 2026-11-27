// src/firebase.js - FIXED for global-otp-c538a
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUy_-qiYzRBG8Swnfg0zpZcemH2ms2SVk",
  authDomain: "global-otp-c538a.firebaseapp.com",
  projectId: "global-otp-c538a",
  storageBucket: "global-otp-c538a.firebasestorage.app",
  messagingSenderId: "56557169051",
  appId: "1:56557169051:web:cff1aa28cec5c88e9f193e",
  measurementId: "G-YJB9BV75S4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
