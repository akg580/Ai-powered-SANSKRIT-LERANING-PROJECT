// src/utils/chapterUtils.js — Devavāṇī v5.0
// Small pure helpers shared by chapter-related screens.

export function cleanTitle(t) { return t.replace(/\s*\([^)]*\)/g,"").replace(/\s+[—–].*$/,"").trim(); }

export function getSubchapters(ch) { return ch.concepts.map((c,i)=>({id:`${ch.id}.${i+1}`,title:cleanTitle(c.term),concept:c})); }