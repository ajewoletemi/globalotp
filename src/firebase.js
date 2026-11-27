// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUy_-qiYzRBG8Swnfg0zpZcemH2ms2SVk",
  authDomain: "global-otp-c538a.firebaseapp.com",
  projectId: "global-otp-c538a",
  storageBucket: "global-otp-c538a.firebasestorage.app",
  messagingSenderId: "56557169051",
  appId: "1:56557169051:web:7c6f330808bdee849f193e",
  measurementId: "G-27BKNPNLRH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
