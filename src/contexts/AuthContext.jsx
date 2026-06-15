// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user,        setUser]        = useState(null);   // Firebase user object
  const [userProfile, setUserProfile] = useState(null);   // Firestore profile doc
  const [loading,     setLoading]     = useState(true);   // initial auth check
  const [error,       setError]       = useState("");

  // ── Sign Up ────────────────────────────────────────────────────────────────
  async function signup(email, password, displayName) {
    setError("");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Set display name on the Firebase Auth user
    await updateProfile(cred.user, { displayName });
    // Create Firestore profile document
    const profileData = {
      uid:         cred.user.uid,
      email:       email.toLowerCase(),
      displayName,
      createdAt:   serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      avatarColor: pickColor(cred.user.uid),
    };
    await setDoc(doc(db, "users", cred.user.uid), profileData);
    setUserProfile(profileData);
    return cred.user;
  }

  // ── Login ──────────────────────────────────────────────────────────────────
  async function login(email, password) {
    setError("");
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // Update lastLoginAt
    await setDoc(
      doc(db, "users", cred.user.uid),
      { lastLoginAt: serverTimestamp() },
      { merge: true }
    );
    return cred.user;
  }

  // ── Logout ─────────────────────────────────────────────────────────────────
  async function logout() {
    setError("");
    await signOut(auth);
    setUserProfile(null);
  }

  // ── Password Reset ─────────────────────────────────────────────────────────
  async function resetPassword(email) {
    setError("");
    await sendPasswordResetEmail(auth, email);
  }

  // ── Listen for auth state changes ─────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch Firestore profile
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (snap.exists()) setUserProfile(snap.data());
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    error,
    setError,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#B8860B","#4A7C59","#C8503A","#3B6B9A",
  "#7B4F8A","#2A7F7F","#C8703A","#9B4A6A",
];
function pickColor(uid) {
  const idx = uid.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}
