// src/components/ui/ThemeToggle.jsx — Devavāṇī v5.0
// Single sun/moon icon button that flips light <-> dark theme.

export function ThemeToggle({theme,onToggle}){
  return(
    <button
      className="theme-toggle-single"
      onClick={onToggle}
      aria-label={theme==="dark"?"Switch to light mode":"Switch to dark mode"}
      title={theme==="dark"?"Light mode":"Dark mode"}
    >
      {theme==="dark" ? "☀️" : "🌙"}
    </button>
  );
}