// src/components/AdminPanel.jsx — Devavāṇī v4.1
// Full CMS: chapters · concepts · quiz · vedic · user roles
// Admin = full access · Editor = content only (no users tab)
import { useState, useEffect } from "react";
import { useAuth, ROLES } from "../contexts/AuthContext";
import { useCMS }  from "../contexts/CMSContext";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/runtimeConfig";

/* ── Small UI helpers ──────────────────────────────────────────────────────── */
function Badge({ color, children }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center",
      padding:"2px 9px", borderRadius:"var(--r-pill)",
      fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
      background:`${color}18`, color, border:`1px solid ${color}44`,
    }}>{children}</span>
  );
}

function roleColor(r) {
  return r==="admin"?"var(--saffron)":r==="editor"?"var(--teal)":"var(--text-muted)";
}

function Btn({ onClick, children, variant="ghost", size="sm", disabled, style={} }) {
  const base = {
    display:"inline-flex", alignItems:"center", gap:5,
    padding: size==="sm"?"5px 11px":"9px 18px",
    borderRadius:"var(--r-sm)", fontSize:12, fontWeight:700,
    cursor:disabled?"not-allowed":"pointer", fontFamily:"var(--font-body)",
    transition:"all 0.15s", border:"1.5px solid", opacity:disabled?0.45:1,
  };
  const vars = {
    ghost:   { background:"var(--surface-1)", color:"var(--text-secondary)", borderColor:"var(--border-soft)" },
    primary: { background:"var(--gold-vivid)", color:"#fff", borderColor:"transparent", boxShadow:"0 2px 8px var(--gold-glow)" },
    danger:  { background:"var(--saffron-lt)", color:"var(--saffron)", borderColor:"rgba(214,65,10,0.25)" },
    teal:    { background:"var(--teal-lt)", color:"var(--teal)", borderColor:"rgba(13,148,136,0.25)" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...base, ...vars[variant], ...style }}>
      {children}
    </button>
  );
}

function Input({ label, value, onChange, placeholder="", multiline=false, rows=3 }) {
  const sharedStyle = {
    width:"100%", padding:"9px 12px",
    border:"1.5px solid var(--border-soft)",
    borderRadius:"var(--r-sm)",
    background:"var(--surface-0)",
    color:"var(--text-primary)",
    fontSize:13, fontFamily:"var(--font-body)",
    outline:"none", transition:"border-color 0.15s",
    resize: multiline ? "vertical" : undefined,
  };
  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      {multiline
        ? <textarea style={sharedStyle} rows={rows} value={value} onChange={onChange} placeholder={placeholder}
            onFocus={e=>e.target.style.borderColor="var(--gold-vivid)"}
            onBlur={e=>e.target.style.borderColor="var(--border-soft)"}/>
        : <input style={sharedStyle} value={value} onChange={onChange} placeholder={placeholder}
            onFocus={e=>e.target.style.borderColor="var(--gold-vivid)"}
            onBlur={e=>e.target.style.borderColor="var(--border-soft)"}/>
      }
    </div>
  );
}

function Confirm({ msg, onConfirm, onCancel }) {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:999,
      background:"rgba(0,0,0,0.50)", backdropFilter:"blur(4px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }}>
      <div className="card" style={{ maxWidth:380, width:"100%", padding:24 }}>
        <div style={{ fontSize:20, marginBottom:10 }}>⚠️</div>
        <p style={{ fontSize:14, color:"var(--text-secondary)", marginBottom:20, lineHeight:1.6 }}>{msg}</p>
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="danger" onClick={onConfirm}>Yes, delete</Btn>
          <Btn variant="ghost"  onClick={onCancel}>Cancel</Btn>
        </div>
      </div>
    </div>
  );
}

/* ── CONCEPT EDITOR ─────────────────────────────────────────────────────────── */
function ConceptEditor({ chapter }) {
  const { addConcept, updateConcept, deleteConcept, saving } = useCMS();
  const [editing, setEditing]   = useState(null); // index or "new"
  const [form, setForm]         = useState({});
  const [confirm, setConfirm]   = useState(null);
  const [msg, setMsg]           = useState("");

  const blank = { term:"", meaning:"", example:"", cat:"core", sutra:"" };

  function startEdit(idx) {
    setEditing(idx);
    setForm(idx === "new" ? blank : { ...chapter.concepts[idx] });
    setMsg("");
  }

  async function save() {
    if (!form.term.trim()) { setMsg("Term is required."); return; }
    try {
      if (editing === "new") await addConcept(chapter.id, form);
      else await updateConcept(chapter.id, editing, form);
      setEditing(null); setMsg("✅ Saved");
    } catch(e) { setMsg(`❌ ${e.message}`); }
  }

  async function del(idx) {
    try { await deleteConcept(chapter.id, idx); setConfirm(null); }
    catch(e) { setMsg(`❌ ${e.message}`); }
  }

  return (
    <div>
      <div className="section-header">
        <span style={{ fontWeight:700, fontSize:14 }}>📚 Concepts ({chapter.concepts?.length || 0})</span>
        <Btn variant="teal" onClick={() => startEdit("new")}>+ Add Concept</Btn>
      </div>

      {msg && <div style={{ fontSize:12, color:msg.startsWith("✅")?"var(--teal)":"var(--saffron)", marginBottom:10 }}>{msg}</div>}

      {confirm !== null && (
        <Confirm msg="Delete this concept? This cannot be undone."
          onConfirm={() => del(confirm)} onCancel={() => setConfirm(null)}/>
      )}

      {/* Inline editor */}
      {editing !== null && (
        <div className="section-box" style={{ marginBottom:14, padding:18 }}>
          <div style={{ fontWeight:700, fontSize:13, marginBottom:12 }}>
            {editing === "new" ? "New Concept" : `Edit Concept ${editing + 1}`}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Input label="Term (Sanskrit + English)" value={form.term||""} onChange={e=>setForm(f=>({...f,term:e.target.value}))} placeholder="e.g. वृद्धि (Vṛddhi)"/>
            <Input label="Category" value={form.cat||""} onChange={e=>setForm(f=>({...f,cat:e.target.value}))} placeholder="samjna, phonetics, core…"/>
          </div>
          <Input label="Meaning / Explanation" value={form.meaning||""} onChange={e=>setForm(f=>({...f,meaning:e.target.value}))} multiline rows={3} placeholder="Clear explanation of the concept…"/>
          <Input label="Example" value={form.example||""} onChange={e=>setForm(f=>({...f,example:e.target.value}))} placeholder="Sanskrit example or formula"/>
          <Input label="Sūtra Reference (optional)" value={form.sutra||""} onChange={e=>setForm(f=>({...f,sutra:e.target.value}))} placeholder="e.g. 1.1.1"/>
          <div style={{ display:"flex", gap:8, marginTop:6 }}>
            <Btn variant="primary" onClick={save} disabled={saving}>{saving?"Saving…":"Save Concept"}</Btn>
            <Btn variant="ghost"   onClick={() => setEditing(null)}>Cancel</Btn>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {(chapter.concepts || []).map((c, i) => (
          <div key={i} className="concept-card" style={{ borderLeftColor:"var(--gold-vivid)", padding:"12px 14px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:"var(--text-primary)", marginBottom:3 }}>{c.term}</div>
                <div style={{ fontSize:12, color:"var(--text-muted)" }}>{c.meaning?.slice(0,100)}…</div>
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <Btn variant="ghost" onClick={() => startEdit(i)}>✏️ Edit</Btn>
                <Btn variant="danger" onClick={() => setConfirm(i)}>🗑️</Btn>
              </div>
            </div>
          </div>
        ))}
        {!chapter.concepts?.length && (
          <div style={{ textAlign:"center", padding:"24px", color:"var(--text-muted)", fontSize:13 }}>
            No concepts yet. Click "+ Add Concept" to begin.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── QUIZ EDITOR ─────────────────────────────────────────────────────────────── */
function QuizEditor({ chapter }) {
  const { addQuizQuestion, updateQuizQuestion, deleteQuizQuestion, saving } = useCMS();
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState({});
  const [confirm, setConfirm] = useState(null);
  const [msg, setMsg]         = useState("");

  const blank = { q:"", opts:["","","",""], ans:0, exp:"" };

  function startEdit(idx) {
    setEditing(idx);
    const src = idx === "new" ? blank : chapter.quiz[idx];
    setForm({ ...src, opts: [...(src.opts || ["","","",""])] });
    setMsg("");
  }

  function setOpt(i, val) { setForm(f => { const o=[...f.opts]; o[i]=val; return {...f,opts:o}; }); }

  async function save() {
    if (!form.q.trim()) { setMsg("Question is required."); return; }
    if (form.opts.filter(o=>o.trim()).length < 2) { setMsg("At least 2 options required."); return; }
    try {
      if (editing === "new") await addQuizQuestion(chapter.id, form);
      else await updateQuizQuestion(chapter.id, editing, form);
      setEditing(null); setMsg("✅ Saved");
    } catch(e) { setMsg(`❌ ${e.message}`); }
  }

  async function del(idx) {
    try { await deleteQuizQuestion(chapter.id, idx); setConfirm(null); }
    catch(e) { setMsg(`❌ ${e.message}`); }
  }

  return (
    <div>
      <div className="section-header">
        <span style={{ fontWeight:700, fontSize:14 }}>⚡ Quiz Questions ({chapter.quiz?.length || 0})</span>
        <Btn variant="teal" onClick={() => startEdit("new")}>+ Add Question</Btn>
      </div>

      {msg && <div style={{ fontSize:12, color:msg.startsWith("✅")?"var(--teal)":"var(--saffron)", marginBottom:10 }}>{msg}</div>}
      {confirm !== null && <Confirm msg="Delete this quiz question?" onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}

      {editing !== null && (
        <div className="section-box" style={{ marginBottom:14, padding:18 }}>
          <div style={{ fontWeight:700, fontSize:13, marginBottom:12 }}>{editing==="new"?"New Question":`Edit Q${editing+1}`}</div>
          <Input label="Question" value={form.q||""} onChange={e=>setForm(f=>({...f,q:e.target.value}))} placeholder="Enter question text…"/>
          <div style={{ marginBottom:12 }}>
            <label className="form-label">Options (A–D)</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", flexShrink:0 }}>
                    <input type="radio" name="correct" checked={form.ans===i}
                      onChange={() => setForm(f=>({...f,ans:i}))}
                      style={{ accentColor:"var(--gold-vivid)" }}/>
                    <span style={{ fontSize:11, fontWeight:700, color:"var(--gold-vivid)" }}>{String.fromCharCode(65+i)}</span>
                  </label>
                  <input
                    value={form.opts?.[i]||""}
                    onChange={e => setOpt(i, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65+i)}…`}
                    style={{ flex:1, padding:"7px 10px", border:"1.5px solid var(--border-soft)", borderRadius:"var(--r-sm)", background:"var(--surface-0)", color:"var(--text-primary)", fontSize:12, fontFamily:"var(--font-body)", outline:"none" }}
                    onFocus={e=>e.target.style.borderColor="var(--gold-vivid)"}
                    onBlur={e=>e.target.style.borderColor="var(--border-soft)"}
                  />
                </div>
              ))}
            </div>
            <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:5 }}>Select the radio button next to the correct answer.</div>
          </div>
          <Input label="Explanation (shown after answer)" value={form.exp||""} onChange={e=>setForm(f=>({...f,exp:e.target.value}))} multiline rows={2} placeholder="Explain why the correct answer is right…"/>
          <div style={{ display:"flex", gap:8, marginTop:6 }}>
            <Btn variant="primary" onClick={save} disabled={saving}>{saving?"Saving…":"Save Question"}</Btn>
            <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
          </div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {(chapter.quiz || []).map((q, i) => (
          <div key={i} className="section-box" style={{ padding:"11px 14px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)", marginBottom:4 }}>
                  Q{i+1}: {q.q?.slice(0,80)}
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {(q.opts||[]).map((o,oi) => (
                    <span key={oi} style={{ fontSize:11, padding:"2px 7px", borderRadius:4,
                      background: oi===q.ans?"var(--teal-lt)":"var(--surface-2)",
                      color: oi===q.ans?"var(--teal)":"var(--text-muted)",
                      border:`1px solid ${oi===q.ans?"var(--teal)":"var(--border-faint)"}`,
                      fontWeight: oi===q.ans?700:400,
                    }}>
                      {String.fromCharCode(65+oi)}: {o}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <Btn variant="ghost" onClick={() => startEdit(i)}>✏️</Btn>
                <Btn variant="danger" onClick={() => setConfirm(i)}>🗑️</Btn>
              </div>
            </div>
          </div>
        ))}
        {!chapter.quiz?.length && (
          <div style={{ textAlign:"center", padding:"24px", color:"var(--text-muted)", fontSize:13 }}>No quiz questions yet.</div>
        )}
      </div>
    </div>
  );
}

/* ── VEDIC EDITOR ─────────────────────────────────────────────────────────────── */
function VedicEditor({ chapter }) {
  const { addVedic, updateVedic, deleteVedic, saving } = useCMS();
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState({});
  const [confirm, setConfirm] = useState(null);
  const [msg, setMsg]         = useState("");

  const blank = { dev:"", roman:"", trans:"", source:"", rel:"" };

  function startEdit(idx) {
    setEditing(idx);
    setForm(idx === "new" ? blank : { ...chapter.vedic[idx] });
    setMsg("");
  }

  async function save() {
    if (!form.dev.trim() && !form.roman.trim()) { setMsg("At least Devanagari or Roman text required."); return; }
    try {
      if (editing === "new") await addVedic(chapter.id, form);
      else await updateVedic(chapter.id, editing, form);
      setEditing(null); setMsg("✅ Saved");
    } catch(e) { setMsg(`❌ ${e.message}`); }
  }

  async function del(idx) {
    try { await deleteVedic(chapter.id, idx); setConfirm(null); }
    catch(e) { setMsg(`❌ ${e.message}`); }
  }

  return (
    <div>
      <div className="section-header">
        <span style={{ fontWeight:700, fontSize:14 }}>📜 Vedic Sources ({chapter.vedic?.length || 0})</span>
        <Btn variant="teal" onClick={() => startEdit("new")}>+ Add Source</Btn>
      </div>

      {msg && <div style={{ fontSize:12, color:msg.startsWith("✅")?"var(--teal)":"var(--saffron)", marginBottom:10 }}>{msg}</div>}
      {confirm !== null && <Confirm msg="Delete this Vedic source?" onConfirm={()=>del(confirm)} onCancel={()=>setConfirm(null)}/>}

      {editing !== null && (
        <div className="section-box" style={{ marginBottom:14, padding:18 }}>
          <div style={{ fontWeight:700, fontSize:13, marginBottom:12 }}>{editing==="new"?"New Vedic Source":`Edit Source ${editing+1}`}</div>
          <Input label="Devanagari Text" value={form.dev||""} onChange={e=>setForm(f=>({...f,dev:e.target.value}))} multiline rows={2} placeholder="संस्कृत देवनागरी…"/>
          <Input label="Roman Transliteration" value={form.roman||""} onChange={e=>setForm(f=>({...f,roman:e.target.value}))} placeholder="IAST romanization…"/>
          <Input label="Translation" value={form.trans||""} onChange={e=>setForm(f=>({...f,trans:e.target.value}))} placeholder="English meaning…"/>
          <Input label="Source / Citation" value={form.source||""} onChange={e=>setForm(f=>({...f,source:e.target.value}))} placeholder="e.g. Ṛgveda 1.1.1 / Aṣṭādhyāyī 1.1.1"/>
          <Input label="Grammar Connection (rel)" value={form.rel||""} onChange={e=>setForm(f=>({...f,rel:e.target.value}))} multiline rows={3} placeholder="Explain the grammatical connection to the chapter concepts…"/>
          <div style={{ display:"flex", gap:8, marginTop:6 }}>
            <Btn variant="primary" onClick={save} disabled={saving}>{saving?"Saving…":"Save Source"}</Btn>
            <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
          </div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {(chapter.vedic || []).map((v, i) => (
          <div key={i} className="vedic-card" style={{ padding:"12px 14px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
              <div style={{ flex:1 }}>
                <div className="vedic-dev" style={{ fontSize:14, marginBottom:3 }}>{v.dev?.slice(0,80)||"—"}</div>
                <div style={{ fontSize:11, color:"var(--text-muted)" }}>{v.source}</div>
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <Btn variant="ghost" onClick={() => startEdit(i)}>✏️</Btn>
                <Btn variant="danger" onClick={() => setConfirm(i)}>🗑️</Btn>
              </div>
            </div>
          </div>
        ))}
        {!chapter.vedic?.length && (
          <div style={{ textAlign:"center", padding:"24px", color:"var(--text-muted)", fontSize:13 }}>No Vedic sources yet.</div>
        )}
      </div>
    </div>
  );
}

/* ── CHAPTER META EDITOR ──────────────────────────────────────────────────────── */
function ChapterMetaEditor({ chapter, onClose }) {
  const { saveChapter, deleteChapter, saving } = useCMS();
  const { userProfile } = useAuth();
  const [form, setForm] = useState({ ...chapter });
  const [confirm, setConfirm] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    if (!form.title.trim()) { setMsg("Title required."); return; }
    try { await saveChapter(form); setMsg("✅ Chapter saved"); }
    catch(e) { setMsg(`❌ ${e.message}`); }
  }

  async function del() {
    try { await deleteChapter(chapter.id); onClose(); }
    catch(e) { setMsg(`❌ ${e.message}`); setConfirm(false); }
  }

  return (
    <div style={{ padding:"14px 0" }}>
      {confirm && <Confirm msg={`Delete Chapter ${chapter.num}: ${chapter.title}? All content will be lost.`} onConfirm={del} onCancel={()=>setConfirm(false)}/>}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
        <Input label="Chapter Title" value={form.title||""} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
        <Input label="Chapter Number (e.g. III)" value={form.num||""} onChange={e=>setForm(f=>({...f,num:e.target.value}))}/>
        <Input label="Icon (emoji)" value={form.icon||""} onChange={e=>setForm(f=>({...f,icon:e.target.value.slice(0,4)}))} placeholder="🔤"/>
        <div className="form-field">
          <label className="form-label">Accent Color</label>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <input type="color" value={form.color||"#C8860A"} onChange={e=>setForm(f=>({...f,color:e.target.value}))}
              style={{ height:36, flex:1, border:"none", padding:3, borderRadius:8, cursor:"pointer", background:"transparent" }}/>
            <span style={{ fontSize:11, color:"var(--text-muted)", fontFamily:"var(--font-mono)" }}>{form.color}</span>
          </div>
        </div>
      </div>
      <Input label="Subtitle" value={form.subtitle||""} onChange={e=>setForm(f=>({...f,subtitle:e.target.value}))} placeholder="Short description…"/>
      {msg && <div style={{ fontSize:12, color:msg.startsWith("✅")?"var(--teal)":"var(--saffron)", margin:"8px 0" }}>{msg}</div>}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <Btn variant="primary" onClick={save} disabled={saving}>{saving?"Saving…":"Save Chapter Info"}</Btn>
        {userProfile?.role === "admin" && (
          <Btn variant="danger" onClick={() => setConfirm(true)}>🗑️ Delete Chapter</Btn>
        )}
        <Btn variant="ghost" onClick={onClose}>Close</Btn>
      </div>
    </div>
  );
}

/* ── USER MANAGER (admin only) ────────────────────────────────────────────────── */
function UserManager() {
  const { setUserRole, user: currentUser } = useAuth();
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]       = useState("");

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "users"), orderBy("email")));
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch(e) { setMsg(`❌ ${e.message}`); }
      finally { setLoading(false); }
    })();
  }, []);

  async function changeRole(uid, role) {
    try {
      await setUserRole(uid, role);
      setUsers(us => us.map(u => u.uid===uid||u.id===uid ? {...u,role} : u));
      setMsg("✅ Role updated");
      setTimeout(() => setMsg(""), 2000);
    } catch(e) { setMsg(`❌ ${e.message}`); }
  }

  if (loading) return <div style={{ textAlign:"center", padding:32, color:"var(--text-muted)" }}>Loading users…</div>;

  return (
    <div>
      <div className="section-header" style={{ marginBottom:14 }}>
        <span style={{ fontWeight:700, fontSize:14 }}>👥 All Users ({users.length})</span>
        {msg && <span style={{ fontSize:12, color:msg.startsWith("✅")?"var(--teal)":"var(--saffron)" }}>{msg}</span>}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {users.map(u => {
          const isMe = u.uid === currentUser?.uid || u.id === currentUser?.uid;
          return (
            <div key={u.id} className="section-box" style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px" }}>
              <div style={{
                width:36, height:36, borderRadius:"50%", flexShrink:0,
                background:`linear-gradient(135deg,${u.avatarColor||"var(--gold-vivid)"},${u.avatarColor||"var(--gold-vivid)"}99)`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:13, fontWeight:800, color:"#fff",
              }}>
                {(u.displayName||u.email||"U").slice(0,2).toUpperCase()}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--text-primary)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {u.displayName || "—"} {isMe && <span style={{ fontSize:10, color:"var(--teal)", fontWeight:700 }}>(you)</span>}
                </div>
                <div style={{ fontSize:11, color:"var(--text-muted)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.email}</div>
              </div>
              <Badge color={roleColor(u.role)}>{u.role || "learner"}</Badge>
              {!isMe && (
                <select
                  value={u.role || "learner"}
                  onChange={e => changeRole(u.uid || u.id, e.target.value)}
                  style={{
                    padding:"5px 8px", borderRadius:"var(--r-sm)",
                    border:"1.5px solid var(--border-soft)",
                    background:"var(--surface-1)", color:"var(--text-primary)",
                    fontSize:12, fontFamily:"var(--font-body)", cursor:"pointer",
                  }}
                >
                  {Object.values(ROLES).map(r => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
        {users.length === 0 && (
          <div style={{ textAlign:"center", padding:24, color:"var(--text-muted)", fontSize:13 }}>No users found in Firestore.</div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN ADMIN PANEL
══════════════════════════════════════════════════════════════════════════════ */
export default function AdminPanel({ onClose }) {
  const { userProfile } = useAuth();
  const { chapters, saving, cmsError, seedFromDefault, canWrite } = useCMS();

  const [activeChapterId, setActiveChapterId] = useState(chapters[0]?.id || null);
  const [contentTab, setContentTab] = useState("concepts"); // concepts|quiz|vedic|meta
  const [adminTab, setAdminTab]     = useState("content");  // content|users
  const [seedMsg, setSeedMsg]       = useState("");

  const activeChapter = chapters.find(c => c.id === activeChapterId);

  const ADMIN_TABS = [
    { k:"content", label:"📚 Content", icon:"📚" },
    ...(userProfile?.role === "admin" ? [{ k:"users", label:"👥 Users", icon:"👥" }] : []),
  ];

  const CONTENT_TABS = [
    { k:"meta",     label:"⚙️ Chapter Info" },
    { k:"concepts", label:"📖 Concepts" },
    { k:"quiz",     label:"⚡ Quiz" },
    { k:"vedic",    label:"📜 Vedic" },
  ];

  async function handleSeed() {
    if (!window.confirm("Seed Firestore with all bundled chapter data? Existing data will be overwritten.")) return;
    setSeedMsg("");
    try { await seedFromDefault(); setSeedMsg("✅ Seeded successfully!"); }
    catch(e) { setSeedMsg(`❌ ${e.message}`); }
  }

  if (!canWrite) {
    return (
      <div style={{ padding:40, textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🔒</div>
        <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, marginBottom:8 }}>Access Denied</h3>
        <p style={{ fontSize:14, color:"var(--text-muted)" }}>You need Admin or Editor role to access the CMS.</p>
        <button className="btn btn-ghost" onClick={onClose} style={{ marginTop:16 }}>← Back</button>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100%", background:"var(--bg-page)" }}>
      {/* ── Header ── */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"14px 20px", borderBottom:"1.5px solid var(--border-soft)",
        background:"var(--bg-nav)", backdropFilter:"blur(20px)",
        position:"sticky", top:0, zIndex:100,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:22 }}>⚙️</span>
          <div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:17, fontWeight:700, color:"var(--text-primary)" }}>
              Devavāṇī CMS
            </div>
            <div style={{ fontSize:11, color:"var(--text-muted)" }}>
              {userProfile?.role === "admin" ? "🔴 Admin" : "🟡 Editor"} — {userProfile?.email}
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {saving && <span style={{ fontSize:11, color:"var(--gold-vivid)" }}>⏳ Saving…</span>}
          {cmsError && <span style={{ fontSize:11, color:"var(--saffron)" }}>❌ {cmsError}</span>}
          <Btn variant="primary" size="sm" onClick={handleSeed} disabled={saving}>
            ⬆️ Seed DB
          </Btn>
          {seedMsg && <span style={{ fontSize:11, color:seedMsg.startsWith("✅")?"var(--teal)":"var(--saffron)" }}>{seedMsg}</span>}
          <Btn variant="ghost" size="sm" onClick={onClose}>✕ Close</Btn>
        </div>
      </div>

      {/* ── Admin tab bar ── */}
      <div style={{ display:"flex", gap:2, padding:"10px 20px 0", borderBottom:"1.5px solid var(--border-soft)", background:"var(--bg-alt)" }}>
        {ADMIN_TABS.map(t => (
          <button key={t.k} onClick={() => setAdminTab(t.k)}
            style={{
              padding:"8px 16px", border:"none", background:"transparent",
              color: adminTab===t.k ? "var(--gold-vivid)" : "var(--text-muted)",
              fontWeight: adminTab===t.k ? 700 : 500, fontSize:13,
              borderBottom: adminTab===t.k ? "2px solid var(--gold-vivid)" : "2px solid transparent",
              marginBottom:-1, cursor:"pointer", fontFamily:"var(--font-body)",
              transition:"all 0.15s",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Users tab ── */}
      {adminTab === "users" && userProfile?.role === "admin" && (
        <div style={{ padding:"20px" }}>
          <UserManager/>
        </div>
      )}

      {/* ── Content tab ── */}
      {adminTab === "content" && (
        <div style={{ display:"flex", flex:1, minHeight:0 }}>
          {/* Chapter sidebar */}
          <div style={{
            width:220, flexShrink:0, padding:"12px 8px",
            borderRight:"1.5px solid var(--border-soft)",
            background:"var(--bg-alt)", overflowY:"auto",
          }}>
            <div style={{ fontSize:10, fontWeight:700, color:"var(--text-faint)", letterSpacing:"0.12em", textTransform:"uppercase", padding:"6px 8px 8px" }}>
              Chapters
            </div>
            {chapters.map(ch => (
              <button key={ch.id}
                onClick={() => { setActiveChapterId(ch.id); setContentTab("concepts"); }}
                style={{
                  width:"100%", padding:"8px 10px", border:"none",
                  background: activeChapterId===ch.id ? "var(--gold-subtle)" : "transparent",
                  borderLeft: activeChapterId===ch.id ? `3px solid ${ch.color}` : "3px solid transparent",
                  color: activeChapterId===ch.id ? "var(--gold-vivid)" : "var(--text-secondary)",
                  fontWeight: activeChapterId===ch.id ? 700 : 500,
                  fontSize:12, cursor:"pointer", textAlign:"left",
                  fontFamily:"var(--font-body)", borderRadius:"0 var(--r-sm) var(--r-sm) 0",
                  transition:"all 0.12s",
                }}>
                <span style={{ fontSize:14, marginRight:6 }}>{ch.icon}</span>
                <span style={{ fontSize:10, color:ch.color, fontWeight:800 }}>{ch.num}</span>{" "}
                {ch.title?.slice(0,22)}
              </button>
            ))}
          </div>

          {/* Content area */}
          {activeChapter ? (
            <div style={{ flex:1, padding:"18px 22px", overflowY:"auto" }}>
              {/* Chapter header */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:12, borderBottom:"1.5px solid var(--border-soft)" }}>
                <div style={{ width:40, height:40, borderRadius:10, background:`${activeChapter.color}18`, border:`2px solid ${activeChapter.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                  {activeChapter.icon}
                </div>
                <div>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:17, fontWeight:700, color:"var(--text-primary)" }}>
                    {activeChapter.title}
                  </div>
                  <div style={{ fontSize:11, color:"var(--text-muted)" }}>
                    {activeChapter.concepts?.length||0} concepts · {activeChapter.quiz?.length||0} quiz Qs · {activeChapter.vedic?.length||0} vedic texts
                  </div>
                </div>
              </div>

              {/* Content sub-tabs */}
              <div style={{ display:"flex", gap:4, marginBottom:18, flexWrap:"wrap" }}>
                {CONTENT_TABS.map(t => (
                  <button key={t.k} onClick={() => setContentTab(t.k)}
                    style={{
                      padding:"6px 14px", border:"1.5px solid",
                      borderRadius:"var(--r-pill)", fontSize:12, fontWeight:700,
                      cursor:"pointer", fontFamily:"var(--font-body)", transition:"all 0.12s",
                      background: contentTab===t.k ? "var(--gold-subtle)" : "var(--surface-1)",
                      color: contentTab===t.k ? "var(--gold-vivid)" : "var(--text-muted)",
                      borderColor: contentTab===t.k ? "var(--border-gold)" : "var(--border-soft)",
                    }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {contentTab === "meta"     && <ChapterMetaEditor chapter={activeChapter} onClose={() => setContentTab("concepts")}/>}
              {contentTab === "concepts" && <ConceptEditor chapter={activeChapter}/>}
              {contentTab === "quiz"     && <QuizEditor chapter={activeChapter}/>}
              {contentTab === "vedic"    && <VedicEditor chapter={activeChapter}/>}
            </div>
          ) : (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text-muted)", fontSize:14 }}>
              Select a chapter to edit
            </div>
          )}
        </div>
      )}
    </div>
  );
}