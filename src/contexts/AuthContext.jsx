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
import { auth, db, isE2EAuthMode, isFirebaseConfigured } from "../firebase/runtimeConfig";

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
const E2E_PROFILE_KEY = "ashtadhyayi.e2e.profile";

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

function readLocalProfile(uid) {
  try {
    const stored = JSON.parse(localStorage.getItem(E2E_PROFILE_KEY) || "null");
    return stored?.uid === uid ? stored : null;
  } catch {
    localStorage.removeItem(E2E_PROFILE_KEY);
    return null;
  }
}

function defaultProfile(firebaseUser) {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email?.toLowerCase() || "",
    displayName: firebaseUser.displayName || "Sanskrit Learner",
    avatarColor: pickColor(firebaseUser.uid),
    bio: "",
    learningGoal: "Master Pāṇini step by step",
    preferredScript: "Devanagari + Roman",
    dailyTarget: 20,
    role: "learner",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function makeTestUser(email = "learner@example.com", displayName = "Sanskrit Learner") {
    return {
      uid: `e2e-${email.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      email,
      displayName,
    };
  }

  async function syncTestUser(firebaseUser) {
    const stored = readLocalProfile(firebaseUser.uid);
    setUser(firebaseUser);
    setUserProfile({
      ...defaultProfile(firebaseUser),
      ...(stored?.uid === firebaseUser.uid ? stored : {}),
    });
    return firebaseUser;
  }

  async function syncUserProfile(firebaseUser) {
    const fallbackProfile = defaultProfile(firebaseUser);

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
    if (isE2EAuthMode) return syncTestUser(makeTestUser(email, displayName));
    assertFirebaseConfigured();
    setError("");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await syncUserProfile(cred.user);
    return cred.user;
  }

  async function login(email, password) {
    if (isE2EAuthMode) return syncTestUser(makeTestUser(email, "Test Scholar"));
    assertFirebaseConfigured();
    setError("");
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await syncUserProfile(cred.user);
    return cred.user;
  }

  async function loginWithGoogle() {
    if (isE2EAuthMode) return syncTestUser(makeTestUser("google.learner@example.com", "Google Learner"));
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
    if (isE2EAuthMode) {
      setUser(null);
      setUserProfile(null);
      return;
    }
    await signOut(auth);
    setUserProfile(null);
  }

  async function resetPassword(email) {
    if (isE2EAuthMode) {
      setError("");
      return;
    }
    assertFirebaseConfigured();
    setError("");
    await sendPasswordResetEmail(auth, email);
  }

  async function updateUserProfile(updates) {
    if (!user) return null;
    const safeUpdates = {
      displayName: updates.displayName?.trim() || userProfile?.displayName || "Sanskrit Learner",
      avatarColor: updates.avatarColor || userProfile?.avatarColor || pickColor(user.uid),
      bio: updates.bio || "",
      learningGoal: updates.learningGoal || "",
      preferredScript: updates.preferredScript || "Devanagari + Roman",
      dailyTarget: Math.max(5, Number(updates.dailyTarget) || 20),
    };
    const nextProfile = {
      ...defaultProfile(user),
      ...userProfile,
      ...safeUpdates,
      updatedAt: isE2EAuthMode ? new Date().toISOString() : serverTimestamp(),
    };

    setUserProfile(nextProfile);

    if (isE2EAuthMode) {
      localStorage.setItem(E2E_PROFILE_KEY, JSON.stringify(nextProfile));
      setUser((current) => current ? { ...current, displayName: safeUpdates.displayName } : current);
      return nextProfile;
    }

    assertFirebaseConfigured();
    if (auth.currentUser && auth.currentUser.displayName !== safeUpdates.displayName) {
      await updateProfile(auth.currentUser, { displayName: safeUpdates.displayName });
    }
    await setDoc(doc(db, "users", user.uid), nextProfile, { merge: true });
    return nextProfile;
  }

  useEffect(() => {
    if (isE2EAuthMode) {
      setLoading(false);
      return undefined;
    }

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
    updateUserProfile,
    isFirebaseConfigured: isFirebaseConfigured || isE2EAuthMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
