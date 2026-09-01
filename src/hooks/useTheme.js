// src/hooks/useTheme.js — Devavāṇī v5.0
// Persists the light/dark theme choice to localStorage and applies it via
// the `data-theme` attribute on <html>, which styles.css keys off of.
import { useState, useEffect, useCallback } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("dv-theme") || "light"; } catch { return "light"; }
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("dv-theme", theme); } catch {}
  }, [theme]);
  const toggle = useCallback(() => setTheme(t => t === "dark" ? "light" : "dark"), []);
  return { theme, toggle };
}