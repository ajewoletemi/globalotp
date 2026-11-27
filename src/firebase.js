import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 1. Create a Firebase project at https://console.firebase.google.com/
// 2. Register a Web App and copy its Firebase config below.
// 3. Enable Authentication > Sign-in method > Phone.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
