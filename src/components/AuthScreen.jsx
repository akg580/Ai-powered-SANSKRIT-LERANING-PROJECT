// src/components/AuthScreen.jsx — Devavāṇī v4.0
// Light/beige default, dark-mode aware via CSS vars
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function validateEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function validatePassword(p){ return {length:p.length>=8,upper:/[A-Z]/.test(p),num:/\d/.test(p)}; }

function GoogleIcon(){
  return(
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true" style={{flexShrink:0}}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

function Field({label,type="text",value,onChange,placeholder,icon,error}){
  const [showPw,setShowPw]=useState(false);
  const isPw=type==="password";
  return(
    <div className="form-field">
      <label className="form-label">{label}</label>
      <div style={{position:"relative"}}>
        {icon&&<span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none",opacity:0.45}}>{icon}</span>}
        <input
          type={isPw&&showPw?"text":type}
          value={value} onChange={onChange} placeholder={placeholder}
          autoComplete={type==="email"?"email":isPw?"current-password":"off"}
          className="form-input"
          style={{paddingLeft:icon?38:13,paddingRight:isPw?40:13,borderColor:error?"var(--saffron)":undefined}}/>
        {isPw&&(
          <button type="button" onClick={()=>setShowPw(s=>!s)}
            style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:13,opacity:0.5,color:"var(--text-primary)",lineHeight:1}}>
            {showPw?"🙈":"👁️"}
          </button>
        )}
      </div>
      {error&&<div style={{fontSize:11,color:"var(--saffron)",marginTop:4}}>⚠ {error}</div>}
    </div>
  );
}

function StrengthBar({password}){
  if(!password) return null;
  const {length,upper,num}=validatePassword(password);
  const score=[length,upper,num].filter(Boolean).length;
  const colors=["","var(--saffron)","var(--gold-vivid)","var(--teal)"];
  const labels=["","Weak","Fair","Strong"];
  return(
    <div style={{marginTop:-4,marginBottom:12}}>
      <div style={{display:"flex",gap:4,marginBottom:4}}>
        {[1,2,3].map(i=>(
          <div key={i} style={{flex:1,height:3,borderRadius:99,background:score>=i?colors[score]:"var(--border-faint)",transition:"background 0.3s"}}/>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <span style={{fontSize:10,color:colors[score],fontWeight:700}}>{labels[score]}</span>
        <span style={{fontSize:10,color:"var(--text-faint)"}}>{!length&&"8+ chars "}{!upper&&"A-Z "}{!num&&"0-9"}</span>
      </div>
    </div>
  );
}

function friendlyError(code){
  const m={
    "auth/user-not-found":"No account with this email.",
    "auth/wrong-password":"Incorrect password.",
    "auth/invalid-credential":"Incorrect email or password.",
    "auth/email-already-in-use":"An account with this email already exists.",
    "auth/weak-password":"Password too weak — min 8 chars, one uppercase, one number.",
    "auth/invalid-email":"Invalid email address.",
    "auth/too-many-requests":"Too many attempts. Please wait a moment.",
    "auth/network-request-failed":"Network error. Check your connection.",
    "auth/invalid-api-key":"Firebase API key missing — check your .env file.",
    "auth/popup-closed-by-user":"Google sign-in was cancelled.",
    "auth/popup-blocked":"Browser blocked the Google popup. Allow popups for this site.",
  };
  return m[code]||"Something went wrong. Please try again.";
}

export default function AuthScreen(){
  const {login,signup,loginWithGoogle,resetPassword,error,setError,isFirebaseConfigured}=useAuth();
  const [mode,setMode]=useState("login");
  const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState("");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [errs,setErrs]=useState({});

  function clearAll(){setErrs({});setError?.("");setSuccess("");}
  function switchMode(m){clearAll();setMode(m);setName("");setEmail("");setPassword("");setConfirm("");}

  async function handleSubmit(e){
    e?.preventDefault(); clearAll();
    const ne={};
    if(mode==="login"){
      if(!validateEmail(email)) ne.email="Enter a valid email";
      if(!password) ne.password="Password required";
      if(Object.keys(ne).length){setErrs(ne);return;}
      setLoading(true);
      try{await login(email,password);}
      catch(err){setError?.(friendlyError(err.code));}
      finally{setLoading(false);}
    } else if(mode==="signup"){
      if(!name.trim()) ne.name="Your name is required";
      if(!validateEmail(email)) ne.email="Enter a valid email";
      const v=validatePassword(password);
      if(!v.length||!v.upper||!v.num) ne.password="Min 8 chars, one uppercase, one number";
      if(password!==confirm) ne.confirm="Passwords do not match";
      if(Object.keys(ne).length){setErrs(ne);return;}
      setLoading(true);
      try{await signup(email,password,name.trim());}
      catch(err){setError?.(friendlyError(err.code));}
      finally{setLoading(false);}
    } else if(mode==="reset"){
      if(!validateEmail(email)){setErrs({email:"Enter a valid email"});return;}
      setLoading(true);
      try{await resetPassword(email);setSuccess("Reset link sent — check your inbox!");}
      catch(err){setError?.(friendlyError(err.code));}
      finally{setLoading(false);}
    }
  }

  async function handleGoogle(){
    clearAll(); setLoading(true);
    try{await loginWithGoogle();}
    catch(err){setError?.(friendlyError(err.code));}
    finally{setLoading(false);}
  }

  return(
    <div className="auth-screen">
      <div style={{width:"100%",maxWidth:408}}>
        {/* Brand header */}
        <div style={{textAlign:"center",marginBottom:22}} className="anim-fade-up">
          <div style={{
            display:"inline-flex",width:64,height:64,borderRadius:"50%",
            background:"linear-gradient(135deg,var(--gold-bright),var(--saffron))",
            alignItems:"center",justifyContent:"center",fontSize:28,
            boxShadow:"var(--shadow-gold)",marginBottom:12,
            animation:"float 3s ease-in-out infinite",
          }}>🕉️</div>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:22,fontWeight:700,color:"var(--text-primary)",margin:"0 0 3px",letterSpacing:"-0.02em"}}>
            Devavāṇī
          </h1>
          <p style={{fontSize:12,color:"var(--text-muted)",margin:0}}>
            Aṣṭādhyāyī Sahajabodha · Pāṇini's Sanskrit Grammar
          </p>
        </div>

        {/* Card */}
        <div className="auth-card anim-scale-in">
          {/* Mode tabs */}
          {mode!=="reset"&&(
            <div style={{display:"flex",background:"var(--surface-2)",borderRadius:"var(--r-sm)",padding:3,marginBottom:20,border:"1.5px solid var(--border-soft)"}}>
              {[["login","Sign In"],["signup","Create Account"]].map(([m,l])=>(
                <button key={m} onClick={()=>switchMode(m)} style={{
                  flex:1,padding:"8px",borderRadius:"var(--r-sm)",border:"none",
                  cursor:"pointer",fontFamily:"var(--font-body)",
                  background:mode===m?"var(--surface-0)":"transparent",
                  color:mode===m?"var(--gold-vivid)":"var(--text-muted)",
                  fontWeight:mode===m?700:500,fontSize:13,
                  boxShadow:mode===m?"var(--shadow-xs)":"none",
                  transition:"all 0.2s",
                }}>{l}</button>
              ))}
            </div>
          )}

          {/* Reset heading */}
          {mode==="reset"&&(
            <div style={{marginBottom:20}}>
              <button onClick={()=>switchMode("login")} style={{background:"none",border:"none",color:"var(--text-muted)",cursor:"pointer",fontSize:12,padding:0,marginBottom:10,fontFamily:"var(--font-body)",display:"flex",alignItems:"center",gap:4}}>
                ← Back to Sign In
              </button>
              <h2 style={{fontFamily:"var(--font-display)",fontSize:20,color:"var(--text-primary)",margin:"0 0 3px"}}>Reset Password</h2>
              <p style={{fontSize:12,color:"var(--text-muted)",margin:0}}>Enter your email and we'll send a reset link.</p>
            </div>
          )}

          {/* Config warning */}
          {!isFirebaseConfigured&&(
            <div style={{background:"var(--gold-bg)",border:"1.5px solid var(--border-gold)",borderRadius:"var(--r-sm)",padding:"10px 14px",marginBottom:14,fontSize:12,color:"var(--gold-vivid)",lineHeight:1.6}}>
              ⚙️ Firebase config missing. Add your keys in <code style={{fontFamily:"var(--font-mono)",fontSize:11}}>.env</code> and restart.
            </div>
          )}

          {/* Error */}
          {error&&(
            <div style={{background:"var(--saffron-lt)",border:"1.5px solid rgba(214,65,10,0.25)",borderRadius:"var(--r-sm)",padding:"10px 14px",marginBottom:14,fontSize:12,color:"var(--saffron)",lineHeight:1.5}}>
              ⚠ {error}
            </div>
          )}

          {/* Success */}
          {success&&(
            <div style={{background:"var(--teal-lt)",border:"1.5px solid rgba(13,148,136,0.25)",borderRadius:"var(--r-sm)",padding:"10px 14px",marginBottom:14,fontSize:12,color:"var(--teal)",lineHeight:1.5}}>
              ✓ {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {mode==="signup"&&<Field label="Your Name" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Arjun Sharma" icon="👤" error={errs.name}/>}
            <Field label="Email Address" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" icon="📧" error={errs.email}/>
            {mode!=="reset"&&(
              <>
                <Field label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}
                  placeholder={mode==="signup"?"Min 8 chars, 1 uppercase, 1 number":"Your password"}
                  icon="🔒" error={errs.password}/>
                {mode==="signup"&&<StrengthBar password={password}/>}
              </>
            )}
            {mode==="signup"&&<Field label="Confirm Password" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Re-enter password" icon="🔒" error={errs.confirm}/>}
            <button type="submit" className="btn btn-primary btn-w" style={{fontSize:14,marginTop:4}} disabled={loading||!isFirebaseConfigured}>
              {loading?"⏳ Please wait…":
               mode==="login"?"🚀 Sign In":
               mode==="signup"?"✨ Create Account":
               "📧 Send Reset Link"}
            </button>
          </form>

          {/* Google */}
          {mode!=="reset"&&(
            <>
              <div style={{display:"flex",alignItems:"center",gap:10,margin:"16px 0"}}>
                <div style={{flex:1,height:1,background:"var(--border-soft)"}}/>
                <span style={{fontSize:10,color:"var(--text-faint)",fontWeight:700,letterSpacing:"0.08em"}}>OR</span>
                <div style={{flex:1,height:1,background:"var(--border-soft)"}}/>
              </div>
              <button type="button" className="btn btn-ghost btn-w" style={{gap:10,fontSize:13}}
                disabled={loading||!isFirebaseConfigured} onClick={handleGoogle}>
                <GoogleIcon/>Continue with Google
              </button>
            </>
          )}

          {/* Forgot */}
          {mode==="login"&&(
            <div style={{textAlign:"center",marginTop:12}}>
              <button onClick={()=>switchMode("reset")} style={{background:"none",border:"none",color:"var(--text-muted)",cursor:"pointer",fontSize:11,textDecoration:"underline",fontFamily:"var(--font-body)"}}>
                Forgot your password?
              </button>
            </div>
          )}

          {/* Features on signup */}
          {mode==="signup"&&(
            <div style={{padding:"12px 14px",background:"var(--gold-bg)",borderRadius:"var(--r-md)",border:"1.5px solid var(--border-gold)",marginTop:14}}>
              <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",letterSpacing:"0.10em",textTransform:"uppercase",marginBottom:9}}>What you unlock</div>
              {[
                {i:"📈",t:"Progress synced across all devices"},
                {i:"🏆",t:"XP points, chapter badges & streaks"},
                {i:"🎴",t:"Flashcards, levelled quizzes, Vedic sources"},
                {i:"📖",t:"7 chapters · 70+ Sanskrit terms"},
              ].map((f,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:"var(--text-secondary)",marginBottom:i<3?6:0}}>
                  <span>{f.i}</span>{f.t}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer verse */}
        <div style={{textAlign:"center",marginTop:18}}>
          <div style={{fontFamily:"var(--font-dev)",fontSize:17,color:"var(--gold-vivid)",marginBottom:3,opacity:0.8}}>
            विद्या ददाति विनयम्
          </div>
          <div style={{fontSize:11,color:"var(--text-faint)",fontStyle:"italic"}}>
            "Knowledge gives humility" — Hitopadeśa
          </div>
          <div style={{fontSize:10,color:"var(--text-faint)",marginTop:8}}>
            By continuing you agree to our terms · No spam ever
          </div>
        </div>
      </div>
    </div>
  );
}