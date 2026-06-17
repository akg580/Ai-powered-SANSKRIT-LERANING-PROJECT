// src/components/AuthScreen.jsx — Devavāṇī v3.0
// Enterprise auth: cosmos dark theme, glassmorphism, full email+Google flows
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

/* ── Validation ─────────────────────────────────────────────────────────── */
function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function validatePassword(p) {
  return { length: p.length >= 8, uppercase: /[A-Z]/.test(p), number: /\d/.test(p) };
}

/* ── Google SVG ─────────────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

/* ── Input field ─────────────────────────────────────────────────────────── */
function Field({ label, type = "text", value, onChange, placeholder, icon, error }) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === "password";

  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none", opacity: 0.5 }}>
            {icon}
          </span>
        )}
        <input
          type={isPw && showPw ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={type === "email" ? "email" : isPw ? "current-password" : "off"}
          className="form-input"
          style={{
            paddingLeft: icon ? 40 : 14,
            paddingRight: isPw ? 44 : 14,
            borderColor: error ? "var(--saffron)" : undefined,
          }}
          onFocus={e => { if (!error) e.target.style.borderColor = "var(--gold-vivid)"; }}
          onBlur={e => { e.target.style.borderColor = error ? "var(--saffron)" : "var(--border-faint)"; }}
        />
        {isPw && (
          <button
            type="button"
            onClick={() => setShowPw(s => !s)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 14, opacity: 0.5, color: "var(--text-primary)" }}
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {error && (
        <div style={{ fontSize: 11, color: "var(--saffron)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
}

/* ── Password strength bar ─────────────────────────────────────────────── */
function StrengthBar({ password }) {
  if (!password) return null;
  const { length, uppercase, number } = validatePassword(password);
  const score = [length, uppercase, number].filter(Boolean).length;
  const colors = ["", "var(--saffron)", "var(--gold-vivid)", "var(--teal)"];
  const labels = ["", "Weak", "Fair", "Strong"];

  return (
    <div style={{ marginTop: -4, marginBottom: 12 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: score >= i ? colors[score] : "var(--border-faint)", transition: "background 0.3s" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, color: colors[score], fontWeight: 700 }}>{labels[score]}</span>
        <span style={{ fontSize: 10, color: "var(--text-faint)" }}>
          {!length && "8+ chars "}{!uppercase && "A-Z "}{!number && "0-9"}
        </span>
      </div>
    </div>
  );
}

/* ── Auth features list ─────────────────────────────────────────────────── */
function Features() {
  const items = [
    { icon: "📈", text: "Progress synced across all devices" },
    { icon: "🏆", text: "XP points, chapter badges, streaks" },
    { icon: "🎴", text: "Flashcards, levelled quizzes, Vedic sources" },
    { icon: "📖", text: "7 structured chapters · 70+ Sanskrit terms" },
  ];
  return (
    <div style={{ padding: "14px 16px", background: "rgba(245,166,35,0.06)", borderRadius: "var(--r-md)", border: "1px solid var(--border-gold)", marginTop: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
        What you unlock
      </div>
      {items.map((f, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)", marginBottom: i < items.length - 1 ? 7 : 0 }}>
          <span>{f.icon}</span>
          {f.text}
        </div>
      ))}
    </div>
  );
}

/* ── Friendly Firebase error mapping ────────────────────────────────────── */
function friendlyError(code) {
  const map = {
    "auth/user-not-found":       "No account with this email. Create one?",
    "auth/wrong-password":       "Incorrect password. Try again or reset below.",
    "auth/invalid-credential":   "Incorrect email or password.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password":        "Password too weak. Min 8 chars, one uppercase, one number.",
    "auth/invalid-email":        "Invalid email address.",
    "auth/too-many-requests":    "Too many attempts. Please wait a few minutes.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/invalid-api-key":      "Firebase API key missing or invalid.",
    "auth/popup-closed-by-user":  "Google sign-in was cancelled.",
    "auth/popup-blocked":         "Browser blocked the Google popup. Allow popups for this site.",
    "auth/account-exists-with-different-credential": "This email uses a different sign-in method.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN AUTH SCREEN
══════════════════════════════════════════════════════════════════════════ */
export default function AuthScreen() {
  const { login, signup, loginWithGoogle, resetPassword, error, setError, isFirebaseConfigured } = useAuth();
  const [mode, setMode]       = useState("login"); // login | signup | reset
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [errs,     setErrs]     = useState({});

  function clearAll() { setErrs({}); setError?.(""); setSuccess(""); }

  function switchMode(m) {
    clearAll();
    setMode(m);
    setName(""); setEmail(""); setPassword(""); setConfirm("");
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    clearAll();
    const newErrs = {};

    if (mode === "login") {
      if (!validateEmail(email)) newErrs.email    = "Enter a valid email";
      if (!password)             newErrs.password = "Password required";
      if (Object.keys(newErrs).length) { setErrs(newErrs); return; }
      setLoading(true);
      try { await login(email, password); }
      catch (err) { setError?.(friendlyError(err.code)); }
      finally { setLoading(false); }

    } else if (mode === "signup") {
      if (!name.trim())          newErrs.name     = "Your name is required";
      if (!validateEmail(email)) newErrs.email    = "Enter a valid email";
      const v = validatePassword(password);
      if (!v.length || !v.uppercase || !v.number)
        newErrs.password = "Min 8 chars, one uppercase, one number";
      if (password !== confirm)  newErrs.confirm  = "Passwords do not match";
      if (Object.keys(newErrs).length) { setErrs(newErrs); return; }
      setLoading(true);
      try { await signup(email, password, name.trim()); }
      catch (err) { setError?.(friendlyError(err.code)); }
      finally { setLoading(false); }

    } else if (mode === "reset") {
      if (!validateEmail(email)) { setErrs({ email: "Enter a valid email" }); return; }
      setLoading(true);
      try { await resetPassword(email); setSuccess("Reset link sent — check your inbox!"); }
      catch (err) { setError?.(friendlyError(err.code)); }
      finally { setLoading(false); }
    }
  }

  async function handleGoogle() {
    clearAll();
    setLoading(true);
    try { await loginWithGoogle(); }
    catch (err) { setError?.(friendlyError(err.code)); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-screen">
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 24 }} className="animate-fade-up">
          <div style={{
            display: "inline-flex", width: 70, height: 70, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--gold-bright), #ff9a3c)",
            alignItems: "center", justifyContent: "center", fontSize: 32,
            boxShadow: "0 8px 28px rgba(245,166,35,0.45)", marginBottom: 14,
            animation: "float 3s ease-in-out infinite",
          }}>
            🕉️
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
            Devavāṇī
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
            Aṣṭādhyāyī Sahajabodha · Pāṇini's Sanskrit Grammar
          </p>
        </div>

        {/* Card */}
        <div className="auth-card animate-scale-in">

          {/* Mode tabs */}
          {mode !== "reset" && (
            <div style={{ display: "flex", background: "var(--surface-0)", borderRadius: "var(--r-sm)", padding: 3, marginBottom: 22, border: "1px solid var(--border-faint)" }}>
              {[["login", "Sign In"], ["signup", "Create Account"]].map(([m, l]) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  style={{
                    flex: 1, padding: "9px", borderRadius: "var(--r-sm)", border: "none",
                    cursor: "pointer", fontFamily: "var(--font-body)",
                    background: mode === m ? "var(--surface-2)" : "transparent",
                    color: mode === m ? "var(--gold-vivid)" : "var(--text-muted)",
                    fontWeight: mode === m ? 700 : 500, fontSize: 13,
                    boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.20)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          )}

          {/* Reset mode heading */}
          {mode === "reset" && (
            <div style={{ marginBottom: 20 }}>
              <button
                onClick={() => switchMode("login")}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 12, fontFamily: "var(--font-body)" }}
              >
                ← Back to Sign In
              </button>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text-primary)", margin: "0 0 4px" }}>Reset Password</h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Enter your email and we'll send a reset link.</p>
            </div>
          )}

          {/* Firebase config warning */}
          {!isFirebaseConfigured && (
            <div style={{ background: "rgba(245,166,35,0.10)", border: "1px solid var(--border-gold)", borderRadius: "var(--r-sm)", padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--gold-vivid)", lineHeight: 1.6 }}>
              ⚙️ Firebase config missing. Add your keys in <code>.env</code> and restart the dev server.
            </div>
          )}

          {/* Error / success */}
          {error && (
            <div style={{ background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.30)", borderRadius: "var(--r-sm)", padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--saffron)", lineHeight: 1.5 }}>
              ⚠ {error}
            </div>
          )}
          {success && (
            <div style={{ background: "rgba(0,201,167,0.12)", border: "1px solid rgba(0,201,167,0.30)", borderRadius: "var(--r-sm)", padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--teal)", lineHeight: 1.5 }}>
              ✓ {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {mode === "signup" && (
              <Field label="Your Name" value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Arjun Sharma" icon="👤" error={errs.name} />
            )}
            <Field label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" icon="📧" error={errs.email} />
            {mode !== "reset" && (
              <>
                <Field label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Min 8 chars, 1 uppercase, 1 number" : "Your password"}
                  icon="🔒" error={errs.password} />
                {mode === "signup" && <StrengthBar password={password} />}
              </>
            )}
            {mode === "signup" && (
              <Field label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter your password" icon="🔒" error={errs.confirm} />
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              style={{ marginTop: 4, fontSize: 15 }}
              disabled={loading || !isFirebaseConfigured}
            >
              {loading ? "⏳ Please wait…" :
               mode === "login"  ? "🚀 Sign In & Continue Learning" :
               mode === "signup" ? "✨ Create My Account" :
                                   "📧 Send Reset Link"}
            </button>
          </form>

          {/* Google */}
          {mode !== "reset" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
                <div style={{ flex: 1, height: 1, background: "var(--border-faint)" }} />
                <span style={{ fontSize: 11, color: "var(--text-faint)", fontWeight: 700, letterSpacing: "0.06em" }}>OR</span>
                <div style={{ flex: 1, height: 1, background: "var(--border-faint)" }} />
              </div>
              <button
                type="button"
                className="btn btn-ghost w-full"
                style={{ gap: 10, fontSize: 14 }}
                disabled={loading || !isFirebaseConfigured}
                onClick={handleGoogle}
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </>
          )}

          {/* Forgot link */}
          {mode === "login" && (
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <button
                onClick={() => switchMode("reset")}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 12, textDecoration: "underline", fontFamily: "var(--font-body)" }}
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Features list on signup */}
          {mode === "signup" && <Features />}
        </div>

        {/* Footer verse */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <div style={{ fontFamily: "var(--font-dev)", fontSize: 18, color: "var(--gold-vivid)", marginBottom: 4, opacity: 0.8 }}>
            विद्या ददाति विनयम्
          </div>
          <div style={{ fontSize: 11, color: "var(--text-faint)", fontStyle: "italic" }}>
            "Knowledge gives humility" — Hitopadeśa
          </div>
          <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 10 }}>
            By continuing, you agree to our terms · No spam ever
          </div>
        </div>
      </div>
    </div>
  );
}