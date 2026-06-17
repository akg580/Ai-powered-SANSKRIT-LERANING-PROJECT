// src/components/UserAvatar.jsx — Devavāṇī v3.0
import { useState, useRef, useEffect } from "react";
import { useAuth }     from "../contexts/AuthContext";
import { useProgress } from "../contexts/ProgressContext";

export default function UserAvatar({ onNavigate, totalChapters = 7 }) {
  const { user, userProfile, logout } = useAuth();
  const { totalXP, completed, streak, syncing } = useProgress();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  if (!user) return null;

  const initials = (userProfile?.displayName || user.email || "U").slice(0, 2).toUpperCase();
  const avatarBg = userProfile?.avatarColor || "var(--gold-vivid)";
  const name     = userProfile?.displayName || user.email;

  function go(page) { setOpen(false); onNavigate?.(page); }

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="User menu"
        aria-expanded={open}
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: `linear-gradient(135deg, ${avatarBg}, ${avatarBg}bb)`,
          border: `2px solid ${open ? "var(--gold-vivid)" : "var(--border-soft)"}`,
          color: "#0a0b14", fontWeight: 800, fontSize: 13,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: open ? "var(--shadow-gold)" : "none",
          transition: "all var(--t-mid)",
          flexShrink: 0,
        }}
      >
        {initials}
      </button>

      {/* Syncing dot */}
      {syncing && (
        <span
          aria-label="Saving"
          style={{
            position: "absolute", top: -2, right: -2,
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--gold-vivid)", border: "1.5px solid var(--bg-void)",
            animation: "pulseGlow 1s infinite",
          }}
        />
      )}

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute", top: 44, right: 0, zIndex: 999,
            width: 250,
            background: "rgba(14,16,34,0.97)",
            border: "1px solid var(--border-soft)",
            borderRadius: "var(--r-lg)",
            boxShadow: "var(--shadow-lg), 0 0 0 1px var(--border-faint)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            overflow: "hidden",
            animation: "scaleIn 0.15s var(--ease-spring) both",
          }}
        >
          {/* Header */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-faint)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: `linear-gradient(135deg, ${avatarBg}, ${avatarBg}bb)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#0a0b14", fontWeight: 800, fontSize: 14, flexShrink: 0,
                border: "2px solid var(--border-gold)",
              }}>
                {initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {name}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, borderBottom: "1px solid var(--border-faint)" }}>
            {[
              { v: `${totalXP || 0}`,                           l: "XP",     c: "var(--gold-vivid)" },
              { v: `${completed?.size || 0}/${totalChapters}`,  l: "Done",   c: "var(--teal)" },
              { v: `🔥${streak || 0}`,                          l: "Streak", c: "var(--saffron)" },
            ].map(s => (
              <div
                key={s.l}
                style={{
                  textAlign: "center", padding: "7px 4px",
                  background: "var(--surface-1)", borderRadius: "var(--r-sm)",
                  border: "1px solid var(--border-faint)",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 9, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Sync status */}
          <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--border-faint)", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 12 }}>{syncing ? "⏳" : "✅"}</span>
            <span style={{ fontSize: 11, color: syncing ? "var(--gold-vivid)" : "var(--teal)" }}>
              {syncing ? "Saving progress…" : "All progress saved"}
            </span>
          </div>

          {/* Menu items */}
          <div style={{ padding: "6px 0" }}>
            <AvatarMenuItem icon="👤" label="Profile & Settings"  onClick={() => go("profile")}  />
            <AvatarMenuItem icon="📈" label="My Progress"         onClick={() => go("progress")} />
            <AvatarMenuItem icon="📚" label="All Chapters"        onClick={() => go("chapters")} />
            <div style={{ height: 1, background: "var(--border-faint)", margin: "4px 8px" }} />
            <AvatarMenuItem
              icon="🚪"
              label="Sign Out"
              onClick={async () => { setOpen(false); await logout?.(); }}
              danger
            />
          </div>
        </div>
      )}
    </div>
  );
}

function AvatarMenuItem({ icon, label, onClick, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", padding: "9px 14px",
        background: hov ? (danger ? "rgba(255,107,53,0.10)" : "var(--surface-1)") : "transparent",
        border: "none", display: "flex", alignItems: "center", gap: 10,
        cursor: "pointer",
        color: danger ? "var(--saffron)" : hov ? "var(--text-primary)" : "var(--text-secondary)",
        fontSize: 13, fontWeight: 500, fontFamily: "var(--font-body)",
        transition: "all var(--t-fast)", textAlign: "left",
      }}
    >
      <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
      {label}
    </button>
  );
}