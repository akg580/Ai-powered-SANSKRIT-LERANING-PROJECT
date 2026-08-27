// src/contexts/CMSContext.jsx — Devavāṇī v4.1
// Content Management: chapters, concepts, quiz questions, vedic texts
// Admin/Editor: add · edit · delete · reorder
// Learners: read-only from Firestore, falls back to bundled CHAPTERS
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { db, isE2EAuthMode } from "../firebase/runtimeConfig";
import { useAuth } from "./AuthContext";

const CMSContext = createContext(null);
export function useCMS() { return useContext(CMSContext); }

// ── Firestore paths ──────────────────────────────────────────────────────────
const CHAPTERS_COL = "cms_chapters";
function chapterRef(id)  { return doc(db, CHAPTERS_COL, String(id)); }
function chaptersCol()   { return collection(db, CHAPTERS_COL); }

// ── ID generator ─────────────────────────────────────────────────────────────
function genId() { return `${Date.now()}-${Math.random().toString(36).slice(2,7)}`; }

// ── Sanitise helpers ─────────────────────────────────────────────────────────
function sanitizeConcept(c) {
  return {
    term:    (c.term    || "").slice(0, 200),
    meaning: (c.meaning || "").slice(0, 1000),
    example: (c.example || "").slice(0, 400),
    cat:     (c.cat     || "core").slice(0, 40),
    sutra:   (c.sutra   || "").slice(0, 40),
  };
}

function sanitizeQuiz(q) {
  return {
    q:    (q.q   || "").slice(0, 500),
    opts: (q.opts || []).map(o => String(o).slice(0, 200)).slice(0, 4),
    ans:  Number(q.ans) || 0,
    exp:  (q.exp || "").slice(0, 600),
  };
}

function sanitizeVedic(v) {
  return {
    dev:    (v.dev    || "").slice(0, 600),
    roman:  (v.roman  || "").slice(0, 600),
    trans:  (v.trans  || "").slice(0, 400),
    source: (v.source || "").slice(0, 200),
    rel:    (v.rel    || "").slice(0, 1200),
  };
}

function sanitizeChapter(ch) {
  return {
    id:       Number(ch.id),
    num:      String(ch.num || "").slice(0, 10),
    title:    String(ch.title || "").slice(0, 120),
    subtitle: String(ch.subtitle || "").slice(0, 200),
    icon:     String(ch.icon || "📖").slice(0, 6),
    color:    /^#[0-9a-fA-F]{6}$/.test(ch.color) ? ch.color : "#C8860A",
    concepts: (ch.concepts || []).map(sanitizeConcept),
    quiz:     (ch.quiz     || []).map(sanitizeQuiz),
    vedic:    (ch.vedic    || []).map(sanitizeVedic),
    levels: {
      easy:   (ch.levels?.easy   || []).map(sanitizeQuiz),
      medium: (ch.levels?.medium || []).map(sanitizeQuiz),
      hard:   (ch.levels?.hard   || []).map(sanitizeQuiz),
    },
    updatedAt: serverTimestamp(),
    updatedBy: "",
  };
}

export function CMSProvider({ children, defaultChapters = [] }) {
  const { userProfile, user } = useAuth();
  const [chapters, setChapters]   = useState(defaultChapters);
  const [cmsLoaded, setCmsLoaded] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [cmsError, setCmsError]   = useState("");

  const canWrite = userProfile?.role === "admin" || userProfile?.role === "editor";

  // ── Real-time listener ───────────────────────────────────────────────────
  useEffect(() => {
    if (isE2EAuthMode) { setCmsLoaded(true); return; }

    const unsub = onSnapshot(
      chaptersCol(),
      snap => {
        if (snap.empty) {
          // Firestore has no chapters yet — fall back to bundled data
          setChapters(defaultChapters);
        } else {
          const loaded = snap.docs
            .map(d => ({ ...d.data(), id: Number(d.id) }))
            .sort((a, b) => a.id - b.id);
          setChapters(loaded);
        }
        setCmsLoaded(true);
      },
      err => {
        console.error("CMS load error:", err);
        setChapters(defaultChapters);
        setCmsLoaded(true);
      }
    );
    return unsub;
  }, []);

  // ── Seed Firestore from bundled data (admin only, once) ──────────────────
  const seedFromDefault = useCallback(async () => {
    if (!canWrite) throw new Error("Not authorised.");
    setSaving(true);
    setCmsError("");
    try {
      const batch = writeBatch(db);
      for (const ch of defaultChapters) {
        const data = sanitizeChapter({ ...ch, updatedBy: user?.email || "" });
        batch.set(chapterRef(ch.id), data);
      }
      await batch.commit();
    } catch (e) {
      setCmsError(e.message);
      throw e;
    } finally { setSaving(false); }
  }, [canWrite, defaultChapters, user]);

  // ── Save entire chapter ──────────────────────────────────────────────────
  const saveChapter = useCallback(async (ch) => {
    if (!canWrite) throw new Error("Not authorised.");
    setSaving(true); setCmsError("");
    try {
      const data = sanitizeChapter({ ...ch, updatedBy: user?.email || "" });
      await setDoc(chapterRef(ch.id), data);
    } catch (e) { setCmsError(e.message); throw e; }
    finally { setSaving(false); }
  }, [canWrite, user]);

  // ── Delete chapter ───────────────────────────────────────────────────────
  const deleteChapter = useCallback(async (chapterId) => {
    if (userProfile?.role !== "admin") throw new Error("Admin only.");
    setSaving(true); setCmsError("");
    try { await deleteDoc(chapterRef(chapterId)); }
    catch (e) { setCmsError(e.message); throw e; }
    finally { setSaving(false); }
  }, [userProfile]);

  // ── Update a single field path in a chapter ──────────────────────────────
  const patchChapter = useCallback(async (chapterId, patch) => {
    if (!canWrite) throw new Error("Not authorised.");
    setSaving(true); setCmsError("");
    try {
      await updateDoc(chapterRef(chapterId), {
        ...patch,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email || "",
      });
    } catch (e) { setCmsError(e.message); throw e; }
    finally { setSaving(false); }
  }, [canWrite, user]);

  // ── Concept CRUD ─────────────────────────────────────────────────────────
  const addConcept = useCallback(async (chapterId, concept) => {
    const ch = chapters.find(c => c.id === chapterId);
    if (!ch) throw new Error("Chapter not found");
    const updated = [...(ch.concepts || []), sanitizeConcept({ ...concept, _id: genId() })];
    await patchChapter(chapterId, { concepts: updated });
  }, [chapters, patchChapter]);

  const updateConcept = useCallback(async (chapterId, index, concept) => {
    const ch = chapters.find(c => c.id === chapterId);
    if (!ch) throw new Error("Chapter not found");
    const updated = ch.concepts.map((c, i) => i === index ? sanitizeConcept(concept) : c);
    await patchChapter(chapterId, { concepts: updated });
  }, [chapters, patchChapter]);

  const deleteConcept = useCallback(async (chapterId, index) => {
    const ch = chapters.find(c => c.id === chapterId);
    if (!ch) throw new Error("Chapter not found");
    const updated = ch.concepts.filter((_, i) => i !== index);
    await patchChapter(chapterId, { concepts: updated });
  }, [chapters, patchChapter]);

  // ── Quiz CRUD ────────────────────────────────────────────────────────────
  const addQuizQuestion = useCallback(async (chapterId, question) => {
    const ch = chapters.find(c => c.id === chapterId);
    if (!ch) throw new Error("Chapter not found");
    const updated = [...(ch.quiz || []), sanitizeQuiz(question)];
    await patchChapter(chapterId, { quiz: updated });
  }, [chapters, patchChapter]);

  const updateQuizQuestion = useCallback(async (chapterId, index, question) => {
    const ch = chapters.find(c => c.id === chapterId);
    if (!ch) throw new Error("Chapter not found");
    const updated = ch.quiz.map((q, i) => i === index ? sanitizeQuiz(question) : q);
    await patchChapter(chapterId, { quiz: updated });
  }, [chapters, patchChapter]);

  const deleteQuizQuestion = useCallback(async (chapterId, index) => {
    const ch = chapters.find(c => c.id === chapterId);
    if (!ch) throw new Error("Chapter not found");
    const updated = ch.quiz.filter((_, i) => i !== index);
    await patchChapter(chapterId, { quiz: updated });
  }, [chapters, patchChapter]);

  // ── Vedic CRUD ───────────────────────────────────────────────────────────
  const addVedic = useCallback(async (chapterId, entry) => {
    const ch = chapters.find(c => c.id === chapterId);
    if (!ch) throw new Error("Chapter not found");
    const updated = [...(ch.vedic || []), sanitizeVedic(entry)];
    await patchChapter(chapterId, { vedic: updated });
  }, [chapters, patchChapter]);

  const updateVedic = useCallback(async (chapterId, index, entry) => {
    const ch = chapters.find(c => c.id === chapterId);
    if (!ch) throw new Error("Chapter not found");
    const updated = ch.vedic.map((v, i) => i === index ? sanitizeVedic(entry) : v);
    await patchChapter(chapterId, { vedic: updated });
  }, [chapters, patchChapter]);

  const deleteVedic = useCallback(async (chapterId, index) => {
    const ch = chapters.find(c => c.id === chapterId);
    if (!ch) throw new Error("Chapter not found");
    const updated = ch.vedic.filter((_, i) => i !== index);
    await patchChapter(chapterId, { vedic: updated });
  }, [chapters, patchChapter]);

  // ── Add new chapter ──────────────────────────────────────────────────────
  const addChapter = useCallback(async (ch) => {
    if (userProfile?.role !== "admin") throw new Error("Admin only.");
    const newId = Math.max(0, ...chapters.map(c => c.id)) + 1;
    await saveChapter({ ...ch, id: newId });
  }, [userProfile, chapters, saveChapter]);

  const value = {
    chapters, cmsLoaded, saving, cmsError,
    canWrite,
    saveChapter, deleteChapter, patchChapter, addChapter,
    addConcept, updateConcept, deleteConcept,
    addQuizQuestion, updateQuizQuestion, deleteQuizQuestion,
    addVedic, updateVedic, deleteVedic,
    seedFromDefault,
  };

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}