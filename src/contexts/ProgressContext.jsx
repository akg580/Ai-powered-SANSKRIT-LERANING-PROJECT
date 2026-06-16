import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, isE2EAuthMode } from "../firebase/runtimeConfig";
import { useAuth } from "./AuthContext";

const ProgressContext = createContext(null);

export function useProgress() {
  return useContext(ProgressContext);
}

function progressRef(uid) {
  return doc(db, "users", uid, "progress", "main");
}

function lastStudyKey(uid) {
  return `lastStudyDate:${uid || "anonymous"}`;
}

const DEFAULT = {
  scores: {},
  completed: [],
  totalXP: 0,
  streak: 0,
  lastStudiedAt: null,
  levelBadges: {},
  quizAttempts: {},
};

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const [scores, setScores] = useState({});
  const [completed, setCompleted] = useState(new Set());
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [levelBadges, setLevelBadges] = useState({});
  const [syncing, setSyncing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const saveTimer = useRef(null);
  const pendingRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setScores({});
      setCompleted(new Set());
      setTotalXP(0);
      setStreak(0);
      setLevelBadges({});
      setLoaded(false);
      return undefined;
    }

    if (isE2EAuthMode) {
      setScores({});
      setCompleted(new Set());
      setTotalXP(0);
      setStreak(0);
      setLevelBadges({});
      setLoaded(true);
      return undefined;
    }

    const unsub = onSnapshot(
      progressRef(user.uid),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setScores(data.scores || {});
          setCompleted(new Set(data.completed || []));
          setTotalXP(data.totalXP || 0);
          setStreak(data.streak || 0);
          setLevelBadges(data.levelBadges || {});
        } else {
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
      }
    );

    return unsub;
  }, [user]);

  const scheduleSave = useCallback((data) => {
    if (!user) return;
    pendingRef.current = data;

    if (isE2EAuthMode) {
      setSyncing(false);
      return;
    }

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
    }, 1200);
  }, [user]);

  function updateStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const key = lastStudyKey(user?.uid);
    const stored = localStorage.getItem(key);
    let newStreak = streak;

    if (stored === today) {
      newStreak = streak;
    } else if (stored === yesterday) {
      newStreak = streak + 1;
    } else {
      newStreak = 1;
    }

    localStorage.setItem(key, today);
    setStreak(newStreak);
    return newStreak;
  }

  function recordScore(chapterId, score, total) {
    const newScores = {
      ...scores,
      [chapterId]: Math.max(scores[chapterId] || 0, score),
    };
    const xpGain = score * 15;
    const newXP = totalXP + xpGain;
    const passed = score >= Math.ceil(total * 0.75);
    const newCompleted = new Set(completed);
    if (passed) newCompleted.add(chapterId);

    setScores(newScores);
    setTotalXP(newXP);
    setCompleted(newCompleted);
    const newStreak = updateStreak();

    scheduleSave({
      scores: newScores,
      completed: [...newCompleted],
      totalXP: newXP,
      streak: newStreak,
      lastStudiedAt: isE2EAuthMode ? new Date().toISOString() : serverTimestamp(),
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

  function resetProgress() {
    setScores({});
    setCompleted(new Set());
    setTotalXP(0);
    setStreak(0);
    setLevelBadges({});
    scheduleSave({
      ...DEFAULT,
      updatedAt: isE2EAuthMode ? new Date().toISOString() : serverTimestamp(),
    });
  }

  function exportProgress() {
    return {
      scores,
      completed: [...completed],
      totalXP,
      streak,
      levelBadges,
    };
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
    resetProgress,
    exportProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}
