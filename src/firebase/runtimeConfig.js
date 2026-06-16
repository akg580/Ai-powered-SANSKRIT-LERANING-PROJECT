import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

const missingFirebaseValue = (value) => {
  if (!value) return true;
  return value.includes("REPLACE") || value.includes("your-project") || value === "123456789";
};

export const isE2EAuthMode = import.meta.env.VITE_E2E_AUTH === "1";

export const isFirebaseConfigured = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
].every((value) => !missingFirebaseValue(value));

const app = initializeApp(
  isFirebaseConfigured
    ? firebaseConfig
    : {
        apiKey: "demo-api-key",
        authDomain: "demo.firebaseapp.com",
        projectId: "demo-project",
        appId: "1:demo:web:demo",
      }
);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
