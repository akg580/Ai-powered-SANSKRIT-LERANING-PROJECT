// src/contexts/AuthContext.jsx — Devavāṇī v4.1
// Role-based auth: admin | editor | learner
// Admin email is seeded from VITE_ADMIN_EMAIL env var (first signup auto-gets admin)
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
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, isE2EAuthMode, isFirebaseConfigured } from "../firebase/runtimeConfig";

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
const E2E_PROFILE_KEY = "dv.e2e.profile.v2";

/* ── Roles ──────────────────────────────────────────────────────────────────
   admin  — full CMS: add/edit/delete chapters, concepts, quiz, vedic, users
   editor — content CMS only: add/edit chapters & content (no user management)
   learner — read-only (default for all new signups)
   ─────────────────────────────────────────────────────────────────────── */
export const ROLES = {
  ADMIN:   "admin",
  EDITOR:  "editor",
  LEARNER: "learner",
};

// Admin email(s) — set in .env as VITE_ADMIN_EMAILS=a@b.com,c@d.com
// These emails automatically receive admin role on first signup/login
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export function useAuth() { return useContext(AuthContext); }

// ── Role helpers ─────────────────────────────────────────────────────────────
export function isAdmin(profile)  { return profile?.role === ROLES.ADMIN; }
export function isEditor(profile) { return profile?.role === ROLES.ADMIN || profile?.role === ROLES.EDITOR; }
export function canManageContent(profile) { return isEditor(profile); }
export function canManageUsers(profile)   { return isAdmin(profile); }

function pickColor(uid) {
  const colors = ["#B8860B","#4A7C59","#C8503A","#3B6B9A","#7B4F8A","#2A7F7F","#C8703A","#9B4A6A"];
  return colors[uid.charCodeAt(0) % colors.length];
}

function resolveRole(email) {
  const e = (email || "").toLowerCase().trim();
  if (ADMIN_EMAILS.includes(e)) return ROLES.ADMIN;
  return ROLES.LEARNER;
}

function assertFirebaseConfigured() {
  if (isFirebaseConfigured) return;
  const err = new Error("Firebase is not configured.");
  err.code = "app/firebase-not-configured";
  throw err;
}

function googleShouldUseRedirect(err) {
  return ["auth/popup-blocked","auth/cancelled-popup-request",
    "auth/operation-not-supported-in-this-environment"].includes(err?.code);
}

function readLocalProfile(uid) {
  try {
    const stored = JSON.parse(localStorage.getItem(E2E_PROFILE_KEY) || "null");
    return stored?.uid === uid ? stored : null;
  } catch { localStorage.removeItem(E2E_PROFILE_KEY); return null; }
}

function defaultProfile(firebaseUser, roleOverride) {
  const role = roleOverride || resolveRole(firebaseUser.email);
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email?.toLowerCase() || "",
    displayName: firebaseUser.displayName || "Sanskrit Learner",
    avatarColor: pickColor(firebaseUser.uid),
    bio: "",
    learningGoal: "Master Pāṇini step by step",
    preferredScript: "Devanagari + Roman",
    dailyTarget: 20,
    role,
    createdAt: new Date().toISOString(),
  };
}

// ── E2E test user helper ─────────────────────────────────────────────────────
function makeTestUser(email = "learner@example.com", displayName = "Sanskrit Learner") {
  return { uid: `e2e-${email.toLowerCase().replace(/[^a-z0-9]/g,"-")}`, email, displayName };
}

export function AuthProvider({ children }) {
  const [user, setUser]             = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  // ── Sync profile from Firestore ─────────────────────────────────────────
  async function syncUserProfile(firebaseUser) {
    const roleFromEmail = resolveRole(firebaseUser.email);
    const fallback = defaultProfile(firebaseUser, roleFromEmail);
    setUserProfile(fallback);

    try {
      const ref  = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const stored = snap.data();
        // Promote to admin if email matches VITE_ADMIN_EMAILS
        const effectiveRole = roleFromEmail === ROLES.ADMIN ? ROLES.ADMIN : (stored.role || ROLES.LEARNER);
        const merged = { ...fallback, ...stored, role: effectiveRole };
        await setDoc(ref, { lastLoginAt: serverTimestamp(), role: effectiveRole }, { merge: true });
        setUserProfile(merged);
      } else {
        // First-time user
        const data = { ...fallback, createdAt: serverTimestamp(), lastLoginAt: serverTimestamp() };
        await setDoc(ref, data);
        setUserProfile({ ...fallback, role: roleFromEmail });
      }
    } catch (err) {
      console.error("Profile sync failed:", err);
    }
    return firebaseUser;
  }

  // ── E2E sync ─────────────────────────────────────────────────────────────
  async function syncTestUser(firebaseUser) {
    const stored = readLocalProfile(firebaseUser.uid);
    const profile = { ...defaultProfile(firebaseUser, ROLES.ADMIN), ...(stored || {}), role: stored?.role || ROLES.ADMIN };
    setUser(firebaseUser);
    setUserProfile(profile);
    return firebaseUser;
  }

  // ── Auth actions ─────────────────────────────────────────────────────────
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
    if (isE2EAuthMode) return syncTestUser(makeTestUser("google@example.com","Google Learner"));
    assertFirebaseConfigured();
    setError("");
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      return syncUserProfile(cred.user);
    } catch (err) {
      if (googleShouldUseRedirect(err)) { await signInWithRedirect(auth, googleProvider); return null; }
      throw err;
    }
  }

  async function logout() {
    setError("");
    if (isE2EAuthMode) { setUser(null); setUserProfile(null); return; }
    await signOut(auth);
    setUserProfile(null);
  }

  async function resetPassword(email) {
    if (isE2EAuthMode) return;
    assertFirebaseConfigured();
    setError("");
    await sendPasswordResetEmail(auth, email);
  }

  // ── Admin: update another user's role ────────────────────────────────────
  async function setUserRole(targetUid, newRole) {
    if (!isAdmin(userProfile)) throw new Error("Not authorized — admin only.");
    if (!Object.values(ROLES).includes(newRole)) throw new Error(`Invalid role: ${newRole}`);
    const ref = doc(db, "users", targetUid);
    await updateDoc(ref, { role: newRole, updatedAt: serverTimestamp() });
  }

  // ── Update own profile ────────────────────────────────────────────────────
  async function updateUserProfile(updates) {
    if (!user) return null;
    const safeUpdates = {
      displayName:     updates.displayName?.trim()  || userProfile?.displayName || "Sanskrit Learner",
      avatarColor:     updates.avatarColor           || userProfile?.avatarColor || pickColor(user.uid),
      bio:             updates.bio             ?? "",
      learningGoal:    updates.learningGoal    ?? "",
      preferredScript: updates.preferredScript ?? "Devanagari + Roman",
      dailyTarget:     Math.max(5, Number(updates.dailyTarget) || 20),
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
      setUser(u => u ? { ...u, displayName: safeUpdates.displayName } : u);
      return nextProfile;
    }

    assertFirebaseConfigured();
    if (auth.currentUser?.displayName !== safeUpdates.displayName)
      await updateProfile(auth.currentUser, { displayName: safeUpdates.displayName });
    await setDoc(doc(db, "users", user.uid), nextProfile, { merge: true });
    return nextProfile;
  }

  // ── onAuthStateChanged ────────────────────────────────────────────────────
  useEffect(() => {
    if (isE2EAuthMode) { setLoading(false); return; }
    if (!isFirebaseConfigured) { setUser(null); setUserProfile(null); setLoading(false); return; }

    getRedirectResult(auth)
      .then(result => { if (result?.user) syncUserProfile(result.user); })
      .catch(err => setError(err.code || "auth/redirect-failed"));

    const unsub = onAuthStateChanged(auth, async firebaseUser => {
      setUser(firebaseUser);
      if (firebaseUser) await syncUserProfile(firebaseUser);
      else setUserProfile(null);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = {
    user, userProfile, loading, error, setError,
    signup, login, loginWithGoogle, logout, resetPassword,
    updateUserProfile, setUserRole,
    isFirebaseConfigured: isFirebaseConfigured || isE2EAuthMode,
    // Role helpers exposed
    isAdmin:  () => isAdmin(userProfile),
    isEditor: () => isEditor(userProfile),
    canManageContent: () => canManageContent(userProfile),
    canManageUsers:   () => canManageUsers(userProfile),
    ROLES,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
