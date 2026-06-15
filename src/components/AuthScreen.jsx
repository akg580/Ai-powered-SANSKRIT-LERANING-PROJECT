// src/components/AuthScreen.jsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const T = {
  bg:"#FAF6EF", bgCard:"#FFFDF7", bgAlt:"#F3EDD8",
  border:"#E2D5B5", borderDk:"#C9B98A",
  text:"#2C1A0E", textMid:"#6B4F2A", textSoft:"#A08850",
  gold:"#B8860B", goldLt:"#D4A843", saffron:"#C8503A",
  green:"#4A7C59", blue:"#3B6B9A", red:"#C8503A",
  shadow:"0 4px 24px rgba(44,26,14,0.12)",
};

// ── Small reusable pieces ──────────────────────────────────────────────────
function Input({ label, type="text", value, onChange, placeholder, icon, error }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: T.textMid, letterSpacing: 0.5, display: "block", marginBottom: 5 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15, opacity: 0.5 }}>
            {icon}
          </span>
        )}
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: "100%", padding: `11px ${isPassword ? 44 : 12}px 11px ${icon ? 38 : 12}px`,
            borderRadius: 10, border: `1.5px solid ${error ? T.red : T.border}`,
            background: T.bgCard, fontSize: 14, color: T.text, outline: "none",
            boxSizing: "border-box", transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = T.gold}
          onBlur={e => e.target.style.borderColor = error ? T.red : T.border}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: 0.5 }}>
            {show ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {error && <div style={{ fontSize: 11, color: T.red, marginTop: 4 }}>⚠ {error}</div>}
    </div>
  );
}

function Btn({ children, onClick, loading, variant = "primary", style: sx = {} }) {
  const isPrimary = variant === "primary";
  return (
    <button onClick={onClick} disabled={loading}
      style={{
        width: "100%", padding: "13px", borderRadius: 12,
        background: isPrimary ? `linear-gradient(135deg,${T.gold},${T.goldLt})` : "transparent",
        border: isPrimary ? "none" : `1.5px solid ${T.border}`,
        color: isPrimary ? "#fff" : T.textMid,
        fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        boxShadow: isPrimary ? `0 4px 16px ${T.gold}40` : "none",
        transition: "all 0.2s", ...sx,
      }}>
      {loading ? "⏳ Please wait…" : children}
    </button>
  );
}

// ── Validation helpers ─────────────────────────────────────────────────────
function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function validatePassword(p) {
  return {
    length:    p.length >= 8,
    uppercase: /[A-Z]/.test(p),
    number:    /\d/.test(p),
  };
}

// ── Password strength bar ──────────────────────────────────────────────────
function StrengthBar({ password }) {
  const { length, uppercase, number } = validatePassword(password);
  const score = [length, uppercase, number].filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Strong"];
  const colors = ["", T.red, T.gold, T.green];
  if (!password) return null;
  return (
    <div style={{ marginTop: 6, marginBottom: 10 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 3 }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 99,
            background: score >= i ? colors[score] : T.border, transition: "background 0.3s" }}/>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 10, color: colors[score] }}>{labels[score]}</div>
        <div style={{ fontSize: 10, color: T.textSoft }}>
          {!length && "8+ chars"} {!uppercase && "A-Z"} {!number && "0-9"}
        </div>
      </div>
    </div>
  );
}

// ── Decorative Sanskrit verse ──────────────────────────────────────────────
function SanskritQuote() {
  return (
    <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
      <div style={{ fontFamily: "'Palatino Linotype',Georgia,serif", fontSize: 17, color: T.gold, lineHeight: 1.8 }}>
        विद्या ददाति विनयम्
      </div>
      <div style={{ fontSize: 11, color: T.textSoft, marginTop: 2, fontStyle: "italic" }}>
        "Knowledge gives humility" — Hitopadeśa
      </div>
    </div>
  );
}

// ── MAIN AUTH SCREEN ───────────────────────────────────────────────────────
export default function AuthScreen() {
  const { login, signup, resetPassword, error, setError } = useAuth();
  const [mode,     setMode]     = useState("login");   // login | signup | reset
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState("");

  // Form fields
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");

  // Field-level errors
  const [errs, setErrs] = useState({});

  function clearAll() { setErrs({}); setError(""); setSuccess(""); }

  function switchMode(m) { clearAll(); setMode(m); setName(""); setEmail(""); setPassword(""); setConfirm(""); }

  // ── Submit handler ─────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e?.preventDefault();
    clearAll();
    const newErrs = {};

    if (mode === "login") {
      if (!validateEmail(email)) newErrs.email = "Enter a valid email";
      if (!password)             newErrs.password = "Password required";
      if (Object.keys(newErrs).length) { setErrs(newErrs); return; }
      setLoading(true);
      try { await login(email, password); }
      catch (err) { setError(friendlyError(err.code)); }
      finally { setLoading(false); }

    } else if (mode === "signup") {
      if (!name.trim())              newErrs.name     = "Your name is required";
      if (!validateEmail(email))     newErrs.email    = "Enter a valid email";
      const { length, uppercase, number } = validatePassword(password);
      if (!length || !uppercase || !number)
        newErrs.password = "Min 8 chars, one uppercase, one number";
      if (password !== confirm)      newErrs.confirm  = "Passwords do not match";
      if (Object.keys(newErrs).length) { setErrs(newErrs); return; }
      setLoading(true);
      try { await signup(email, password, name.trim()); }
      catch (err) { setError(friendlyError(err.code)); }
      finally { setLoading(false); }

    } else if (mode === "reset") {
      if (!validateEmail(email)) { setErrs({ email: "Enter a valid email" }); return; }
      setLoading(true);
      try {
        await resetPassword(email);
        setSuccess("Reset email sent! Check your inbox.");
      }
      catch (err) { setError(friendlyError(err.code)); }
      finally { setLoading(false); }
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, #FDF6E3, #F0E6C8 50%, #FDF6E3)`,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Trebuchet MS',Verdana,sans-serif" }}>

      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "inline-flex", width: 68, height: 68, borderRadius: "50%",
            background: `linear-gradient(135deg,${T.gold},${T.goldLt})`,
            alignItems: "center", justifyContent: "center", fontSize: 32,
            boxShadow: `0 8px 28px ${T.gold}50`, marginBottom: 12 }}>🕉️</div>
          <h1 style={{ fontFamily: "'Palatino Linotype',Georgia,serif", fontSize: 22, fontWeight: 900, color: T.text, margin: "0 0 4px" }}>
            Aṣṭādhyāyī Sahajabodha
          </h1>
          <p style={{ fontSize: 13, color: T.textMid, margin: 0 }}>Pāṇini's Sanskrit Grammar · Pauspi Prakriyā</p>
        </div>

        {/* Card */}
        <div style={{ background: T.bgCard, borderRadius: 18, padding: "28px 28px 24px",
          border: `1px solid ${T.border}`, boxShadow: T.shadow }}>

          {/* Tabs */}
          {mode !== "reset" && (
            <div style={{ display: "flex", background: T.bgAlt, borderRadius: 10, padding: 3, marginBottom: 22 }}>
              {[["login","Sign In"],["signup","Create Account"]].map(([m, l]) => (
                <button key={m} onClick={() => switchMode(m)} style={{
                  flex: 1, padding: "9px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: mode === m ? T.bgCard : "transparent",
                  color: mode === m ? T.gold : T.textSoft,
                  fontWeight: mode === m ? 700 : 500, fontSize: 13,
                  boxShadow: mode === m ? `0 2px 8px rgba(44,26,14,0.1)` : "none",
                  transition: "all 0.2s",
                }}>{l}</button>
              ))}
            </div>
          )}

          {/* Reset Password heading */}
          {mode === "reset" && (
            <div style={{ marginBottom: 20 }}>
              <button onClick={() => switchMode("login")} style={{ background: "none", border: "none", color: T.textSoft, cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 12 }}>← Back to Sign In</button>
              <h2 style={{ fontFamily: "'Palatino Linotype',Georgia,serif", fontSize: 18, color: T.text, margin: "0 0 4px" }}>Reset Password</h2>
              <p style={{ fontSize: 13, color: T.textSoft, margin: 0 }}>Enter your email and we'll send a reset link.</p>
            </div>
          )}

          {/* Global error / success */}
          {error && (
            <div style={{ background: "#FDE8E8", border: "1px solid #f5c2c2", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: T.red }}>
              ⚠ {error}
            </div>
          )}
          {success && (
            <div style={{ background: "#E8F5EA", border: "1px solid #b2dfbf", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: T.green }}>
              ✓ {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <Input label="Your Name" value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Arjun Sharma" icon="👤" error={errs.name}/>
            )}
            <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" icon="📧" error={errs.email}/>
            {mode !== "reset" && (
              <>
                <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Min 8 chars, 1 uppercase, 1 number" : "Your password"} icon="🔒" error={errs.password}/>
                {mode === "signup" && <StrengthBar password={password}/>}
              </>
            )}
            {mode === "signup" && (
              <Input label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter password" icon="🔒" error={errs.confirm}/>
            )}

            <Btn loading={loading}>
              {mode === "login"  ? "🚀 Sign In & Continue Learning" :
               mode === "signup" ? "✨ Create My Account" :
                                   "📧 Send Reset Link"}
            </Btn>
          </form>

          {/* Forgot password */}
          {mode === "login" && (
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <button onClick={() => switchMode("reset")} style={{ background: "none", border: "none", color: T.textSoft, cursor: "pointer", fontSize: 12, textDecoration: "underline" }}>
                Forgot your password?
              </button>
            </div>
          )}

          {/* What you get (signup only) */}
          {mode === "signup" && (
            <div style={{ marginTop: 18, padding: "12px 14px", background: T.bgAlt, borderRadius: 10, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.textMid, marginBottom: 6 }}>What you get:</div>
              {["Progress saved across all devices","XP points & chapter badges","Streak tracking & leaderboard","12 chapters + 180 test questions"].map((f, i) => (
                <div key={i} style={{ fontSize: 12, color: T.textMid, marginBottom: 3 }}>✅ {f}</div>
              ))}
            </div>
          )}
        </div>

        <SanskritQuote/>

        <div style={{ textAlign: "center", fontSize: 11, color: T.textSoft }}>
          By continuing, you agree to our terms · No spam ever
        </div>
      </div>
    </div>
  );
}

// ── Firebase error → friendly message ─────────────────────────────────────
function friendlyError(code) {
  const map = {
    "auth/user-not-found":       "No account found with this email.",
    "auth/wrong-password":       "Incorrect password. Try again.",
    "auth/invalid-credential":   "Incorrect email or password.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password":        "Password is too weak.",
    "auth/invalid-email":        "Invalid email address.",
    "auth/too-many-requests":    "Too many attempts. Please wait a few minutes.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };
  return map[code] || "Something went wrong. Please try again.";
}
