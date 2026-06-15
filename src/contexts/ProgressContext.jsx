// src/contexts/ProgressContext.jsx
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import {
  doc, setDoc, getDoc, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "./AuthContext";

const ProgressContext = createContext(null);

export function useProgress() {
  return useContext(ProgressContext);
}

// ── Firestore document path: users/{uid}/progress/main ────────────────────
function progressRef(uid) {
  return doc(db, "users", uid, "progress", "main");
}

// ── Default empty state ───────────────────────────────────────────────────
const DEFAULT = {
  scores:         {},   // { [chapterId]: highScore }
  completed:      [],   // [chapterId, ...]
  totalXP:        0,
  streak:         0,
  lastStudiedAt:  null,
  levelBadges:    {},   // { [chapterId]: { easy, medium, hard } }
  quizAttempts:   {},   // { [chapterId]: number }
};

export function ProgressProvider({ children }) {
  const { user }         = useAuth();
  const [scores,      setScores]      = useState({});
  const [completed,   setCompleted]   = useState(new Set());
  const [totalXP,     setTotalXP]     = useState(0);
  const [streak,      setStreak]      = useState(0);
  const [levelBadges, setLevelBadges] = useState({});
  const [syncing,     setSyncing]     = useState(false);
  const [loaded,      setLoaded]      = useState(false);

  const saveTimer = useRef(null);       // debounce timer
  const pendingRef = useRef(null);      // latest state to save

  // ── Load progress from Firestore when user logs in ─────────────────────
  useEffect(() => {
    if (!user) {
      // Reset to defaults on logout
      setScores({});
      setCompleted(new Set());
      setTotalXP(0);
      setStreak(0);
      setLevelBadges({});
      setLoaded(false);
      return;
    }

    // Real-time listener — updates UI instantly if changed from another device
    const unsub = onSnapshot(
      progressRef(user.uid),
      (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setScores(d.scores      || {});
        setCompleted(new Set(d.completed || []));
        setTotalXP(d.totalXP    || 0);
        setStreak(d.streak      || 0);
        setLevelBadges(d.levelBadges || {});
      } else {
        // First login — create the document
        setDoc(progressRef(user.uid), {
          ...DEFAULT,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }).catch((err) => console.error("Progress init failed:", err));
      }
      setLoaded(true);
    },
    (err) => {
      console.error("Progress load failed:", err);
      setLoaded(true);
    });

    return unsub;
  }, [user]);

  // ── Debounced save to Firestore ─────────────────────────────────────────
  const scheduleSave = useCallback((data) => {
    if (!user) return;
    pendingRef.current = data;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSyncing(true);
    saveTimer.current = setTimeout(async () => {
      try {
        await setDoc(
          progressRef(user.uid),
          { ...pendingRef.current, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch (err) {
        console.error("Progress save failed:", err);
      } finally {
        setSyncing(false);
      }
    }, 1200); // save 1.2s after last change
  }, [user]);

  // ── Public actions ──────────────────────────────────────────────────────

  function recordScore(chapterId, score, total) {
    const newScores = {
      ...scores,
      [chapterId]: Math.max(scores[chapterId] || 0, score),
    };
    const xpGain   = score * 15;
    const newXP    = totalXP + xpGain;
    const passed   = score >= Math.ceil(total * 0.75);
    const newCompleted = new Set(completed);
    if (passed) newCompleted.add(chapterId);

    const attempts = {}; // track attempts per chapter
    setScores(newScores);
    setTotalXP(newXP);
    setCompleted(newCompleted);
    updateStreak();

    scheduleSave({
      scores:    newScores,
      completed: [...newCompleted],
      totalXP:   newXP,
      streak:    computeStreak(),
      lastStudiedAt: serverTimestamp(),
    });

    return xpGain;
  }

  function recordLevelBadge(chapterId, level) {
    const newBadges = {
      ...levelBadges,
      [chapterId]: { ...(levelBadges[chapterId] || {}), [level]: true },
    };
    setLevelBadges(newBadges);
    scheduleSave({ levelBadges: newBadges });
  }

  function addXP(amount) {
    const newXP = totalXP + amount;
    setTotalXP(newXP);
    scheduleSave({ totalXP: newXP });
  }

  function updateStreak() {
    // Simple daily streak logic
    const today = new Date().toDateString();
    const stored = localStorage.getItem("lastStudyDate");
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let newStreak = streak;
    if (stored === today) {
      // same day — no change
    } else if (stored === yesterday) {
      newStreak = streak + 1;    // consecutive day
    } else {
      newStreak = 1;              // streak broken
    }
    localStorage.setItem("lastStudyDate", today);
    setStreak(newStreak);
    return newStreak;
  }

  function computeStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const stored = localStorage.getItem("lastStudyDate");
    if (stored === today) return streak;
    if (stored === yesterday) return streak + 1;
    return 1;
  }

  const value = {
    scores,
    completed,
    totalXP,
    streak,
    levelBadges,
    syncing,
    loaded,
    recordScore,
    recordLevelBadge,
    addXP,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}
