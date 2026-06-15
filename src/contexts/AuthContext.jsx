import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../firebase/config";

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export function useAuth() {
  return useContext(AuthContext);
}

function pickColor(uid) {
  const colors = [
    "#B8860B", "#4A7C59", "#C8503A", "#3B6B9A",
    "#7B4F8A", "#2A7F7F", "#C8703A", "#9B4A6A",
  ];
  return colors[uid.charCodeAt(0) % colors.length];
}

function assertFirebaseConfigured() {
  if (isFirebaseConfigured) return;
  const err = new Error("Firebase is not configured.");
  err.code = "app/firebase-not-configured";
  throw err;
}

function googleShouldUseRedirect(err) {
  return [
    "auth/popup-blocked",
    "auth/cancelled-popup-request",
    "auth/operation-not-supported-in-this-environment",
  ].includes(err?.code);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function syncUserProfile(firebaseUser) {
    const fallbackProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email?.toLowerCase() || "",
      displayName: firebaseUser.displayName || "Sanskrit Learner",
      avatarColor: pickColor(firebaseUser.uid),
    };

    setUserProfile(fallbackProfile);

    try {
      const profileRef = doc(db, "users", firebaseUser.uid);
      const profileSnap = await getDoc(profileRef);
      const profileData = {
        ...fallbackProfile,
        lastLoginAt: serverTimestamp(),
      };

      if (profileSnap.exists()) {
        await setDoc(profileRef, { lastLoginAt: serverTimestamp() }, { merge: true });
        setUserProfile({ ...fallbackProfile, ...profileSnap.data() });
      } else {
        await setDoc(profileRef, { ...profileData, createdAt: serverTimestamp() });
        setUserProfile(profileData);
      }
    } catch (err) {
      console.error("Profile sync failed:", err);
    }

    return firebaseUser;
  }

  async function signup(email, password, displayName) {
    assertFirebaseConfigured();
    setError("");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await syncUserProfile(cred.user);
    return cred.user;
  }

  async function login(email, password) {
    assertFirebaseConfigured();
    setError("");
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await syncUserProfile(cred.user);
    return cred.user;
  }

  async function loginWithGoogle() {
    assertFirebaseConfigured();
    setError("");

    try {
      const cred = await signInWithPopup(auth, googleProvider);
      return syncUserProfile(cred.user);
    } catch (err) {
      if (googleShouldUseRedirect(err)) {
        await signInWithRedirect(auth, googleProvider);
        return null;
      }
      throw err;
    }
  }

  async function logout() {
    setError("");
    await signOut(auth);
    setUserProfile(null);
  }

  async function resetPassword(email) {
    assertFirebaseConfigured();
    setError("");
    await sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setUser(null);
      setUserProfile(null);
      setLoading(false);
      return undefined;
    }

    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) syncUserProfile(result.user);
      })
      .catch((err) => setError(err.code || "auth/redirect-failed"));

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) await syncUserProfile(firebaseUser);
      else setUserProfile(null);
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
    loginWithGoogle,
    logout,
    resetPassword,
    isFirebaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
