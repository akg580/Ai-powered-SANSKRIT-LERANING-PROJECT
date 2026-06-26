// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDJ-XBwPHzq0oCltvPF2LamlkcVDhZDa0s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "panimmersanskrit.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "panimmersanskrit",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "panimmersanskrit.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "741003088118",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:741003088118:web:d1f49aa13c63138774dcd7",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BJ6N8L4NX8",
};

const missingFirebaseValue = (value) => {
  if (!value) return true;
  return value.includes("REPLACE") || value.includes("your-project") || value === "123456789";
};

export const isFirebaseConfigured = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
].every((value) => !missingFirebaseValue(value));

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
