// src/components/UserAvatar.jsx
import { useState, useRef, useEffect } from "react";
import { useAuth }     from "../contexts/AuthContext";
import { useProgress } from "../contexts/ProgressContext";

const T = {
  bg:"#F6F4FF", bgCard:"#FFFFFF", bgAlt:"#EEF7FF",
  border:"#D9E0F2", text:"#18213A", textMid:"#566078",
  textSoft:"#7B8498", gold:"#5B5EE9", green:"#18A999",
  saffron:"#FF6B6B", shadow:"0 18px 45px rgba(37,48,84,0.14)",
};

export default function UserAvatar({ onNavigate, totalChapters = 7 }) {
  const { user, userProfile, logout } = useAuth();
  const { totalXP, completed, streak, syncing } = useProgress();
  const [open, setOpen] = useState(false);
  const ref  = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  if (!user) return null;

  const initials  = (userProfile?.displayName || user.email || "U").slice(0, 2).toUpperCase();
  const avatarBg  = userProfile?.avatarColor || T.gold;
  const name      = userProfile?.displayName || user.email;
  const totalChaps = totalChapters;
  function go(page) {
    setOpen(false);
    onNavigate?.(page);
  }

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      {/* Avatar button */}
      <button onClick={() => setOpen(o => !o)} style={{
        width: 34, height: 34, borderRadius: "50%",
        background: `linear-gradient(135deg, ${avatarBg}, ${avatarBg}cc)`,
        border: `2px solid ${open ? T.gold : T.border}`,
        color: "#fff", fontWeight: 800, fontSize: 12,
        cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", boxShadow: open ? `0 0 0 3px ${T.gold}30` : "none",
        transition: "all 0.2s", flexShrink: 0,
      }}>
        {initials}
      </button>

      {/* Sync indicator dot */}
      {syncing && (
        <span style={{
          position: "absolute", top: -2, right: -2,
          width: 8, height: 8, borderRadius: "50%",
          background: T.gold, border: "1.5px solid #fff",
          animation: "pulse 1s infinite",
        }}/>
      )}

      {/* Dropdown panel */}
      {open && (
        <div className="avatar-menu" style={{
          position: "absolute", top: 42, right: 0, zIndex: 999,
          width: 240, background: T.bgCard, borderRadius: 14,
          border: `1px solid ${T.border}`, boxShadow: T.shadow,
          overflow: "hidden",
        }}>
          {/* User info header */}
          <div style={{ padding: "14px 16px", background: T.bgAlt, borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: `linear-gradient(135deg,${avatarBg},${avatarBg}cc)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0,
              }}>{initials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
                <div style={{ fontSize: 11, color: T.textSoft,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, borderBottom: `1px solid ${T.border}` }}>
            {[
              { v: `${totalXP}`, l: "XP",      c: T.gold    },
              { v: `${completed.size}/${totalChaps}`, l: "Done", c: T.green   },
              { v: `ðŸ”¥${streak}`, l: "Streak",  c: T.saffron },
            ].map(s => (
              <div key={s.l} style={{ textAlign: "center", padding: "6px 4px",
                background: T.bgAlt, borderRadius: 8, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 9, color: T.textSoft }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Sync status */}
          <div style={{ padding: "8px 16px", borderBottom: `1px solid ${T.border}`,
            display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12 }}>{syncing ? "â³" : "âœ…"}</span>
            <span style={{ fontSize: 11, color: T.textSoft }}>
              {syncing ? "Saving progressâ€¦" : "All progress saved"}
            </span>
          </div>

          {/* Menu items */}
          <div style={{ padding: "6px 0" }}>
            <MenuItem icon="👤" label="Profile & Settings" onClick={() => go("profile")} />
            <MenuItem icon="📊" label="My Progress" onClick={() => go("progress")} />
            <div style={{ height: 1, background: T.border, margin: "4px 0" }} />
            <MenuItem icon="🚪" label="Sign Out" onClick={async () => { setOpen(false); await logout(); }} danger />
          </div>
        </div>
      )}

      {/* Pulse animation */}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

function MenuItem({ icon, label, onClick, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", padding: "9px 16px", background: hov ? (danger ? "#FDE8E8" : T.bgAlt) : "transparent",
        border: "none", display: "flex", alignItems: "center", gap: 10,
        cursor: "pointer", color: danger ? "#C8503A" : T.textMid,
        fontSize: 13, fontWeight: 500, transition: "background 0.15s",
      }}>
      <span style={{ fontSize: 15 }}>{icon}</span> {label}
    </button>
  );
}

