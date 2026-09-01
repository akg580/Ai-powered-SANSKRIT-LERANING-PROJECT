// src/screens/ProfileScreen.jsx — Devavāṇī v5.0
// Account settings, avatar, learning-goal form, and progress-vault actions.
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useProgress } from "../contexts/ProgressContext";

export function ProfileScreen({chapters}){
  const {user,userProfile,updateUserProfile,signOut}=useAuth();
  const {scores,completed,totalXP,streak,syncing,resetProgress}=useProgress();
  const [form,setForm]=useState({displayName:"",bio:"",learningGoal:"",preferredScript:"Devanagari + Roman",dailyTarget:20,avatarColor:"#C8860A"});
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");
  const mastery=chapters.length?Math.round(((completed?.size||0)/chapters.length)*100):0;

  useEffect(()=>{
    if(userProfile) setForm({
      displayName:userProfile.displayName||"",bio:userProfile.bio||"",
      learningGoal:userProfile.learningGoal||"",preferredScript:userProfile.preferredScript||"Devanagari + Roman",
      dailyTarget:userProfile.dailyTarget||20,avatarColor:userProfile.avatarColor||"#C8860A",
    });
  },[userProfile]);

  async function save(e){
    e.preventDefault();setSaving(true);
    try{await updateUserProfile?.(form);setMsg("Profile saved ✓");}
    catch(err){setMsg(err?.message||"Could not save.");}
    finally{setSaving(false);}
  }

  return(
    <div className="main-content">
      <div className="content-inner">
        <div className="label-caps" style={{marginBottom:16}}>Account</div>
        <div className="section-box anim-fade-up" style={{marginBottom:14,padding:"20px 22px"}}>
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            <div className="prof-avatar" style={{background:`linear-gradient(135deg,${form.avatarColor},${form.avatarColor}bb)`,color:"#fff"}}>
              {(form.displayName||user?.email||"U").slice(0,2).toUpperCase()}
            </div>
            <div>
              <h2 style={{fontSize:20,marginBottom:3}}>{form.displayName||"Sanskrit Learner"}</h2>
              <div style={{fontSize:12,color:"var(--text-muted)",marginBottom:8}}>{user?.email}</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                <span className="xp-pill">⭐ {totalXP||0} XP</span>
                <span className="streak-pill">🔥 {streak||0} day streak</span>
                <span className="badge badge-teal">{syncing?"⏳ Saving":"✅ Synced"}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(256px,1fr))",gap:14}}>
          <div className="section-box">
            <div className="section-header"><span style={{fontSize:14,fontWeight:700}}>Profile & Preferences</span></div>
            <form onSubmit={save}>
              <div className="form-field"><label className="form-label">Display Name</label><input className="form-input" value={form.displayName} onChange={e=>setForm(f=>({...f,displayName:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Learning Goal</label><input className="form-input" value={form.learningGoal} onChange={e=>setForm(f=>({...f,learningGoal:e.target.value}))} placeholder="e.g. Read the Aṣṭādhyāyī in 1 year"/></div>
              <div className="form-field"><label className="form-label">Bio</label><textarea className="form-textarea" value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} placeholder="Your Sanskrit journey…"/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div className="form-field"><label className="form-label">Script</label>
                  <select className="form-select" value={form.preferredScript} onChange={e=>setForm(f=>({...f,preferredScript:e.target.value}))}>
                    <option>Devanagari + Roman</option><option>Devanagari only</option><option>Roman only</option>
                  </select>
                </div>
                <div className="form-field"><label className="form-label">Daily Target (min)</label><input className="form-input" type="number" min="5" step="5" value={form.dailyTarget} onChange={e=>setForm(f=>({...f,dailyTarget:e.target.value}))}/></div>
              </div>
              <div className="form-field"><label className="form-label">Avatar Colour</label>
                <input type="color" value={form.avatarColor} onChange={e=>setForm(f=>({...f,avatarColor:e.target.value}))} style={{width:"100%",height:38,border:"none",borderRadius:8,padding:3,cursor:"pointer",background:"transparent"}}/>
              </div>
              {msg&&<div style={{padding:"9px 12px",background:msg.includes("✓")?"var(--teal-lt)":"var(--saffron-lt)",borderRadius:8,fontSize:12,color:msg.includes("✓")?"var(--teal)":"var(--saffron)",marginBottom:10}}>{msg}</div>}
              <button type="submit" className="btn btn-primary btn-w" disabled={saving}>{saving?"Saving…":"Save Profile"}</button>
            </form>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div className="section-box">
              <div className="section-header"><span style={{fontSize:14,fontWeight:700}}>Progress Vault</span></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                {[{v:`${completed?.size||0}/${chapters.length}`,l:"Chapters"},{v:`${totalXP||0}XP`,l:"XP"},{v:`🔥${streak||0}`,l:"Streak"},{v:`${mastery}%`,l:"Mastery"}].map(s=>(
                  <div key={s.l} className="stat-chip"><div className="stat-val" style={{fontSize:17}}>{s.v}</div><div className="stat-lbl">{s.l}</div></div>
                ))}
              </div>
              <div className="pbar" style={{height:5,marginBottom:6}}><div className="pbar-fill" style={{width:`${mastery}%`,height:5}}/></div>
              <div style={{fontSize:11,color:"var(--text-muted)"}}>{mastery}% of curriculum complete</div>
            </div>
            <div className="section-box">
              <div className="section-header"><span style={{fontSize:14,fontWeight:700}}>Account Actions</span></div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                <button className="btn btn-ghost btn-w" onClick={()=>{const d={profile:userProfile,at:new Date().toISOString()};navigator.clipboard?.writeText(JSON.stringify(d,null,2));setMsg("Copied ✓");}}>📋 Export My Data</button>
                <button className="btn btn-ghost btn-w" onClick={()=>{if(window.confirm("Reset all progress? Cannot be undone.")){resetProgress?.();setMsg("Progress reset.");}}}>🔄 Reset Progress</button>
                <button className="btn btn-ghost btn-w" style={{color:"var(--saffron)",borderColor:"rgba(214,65,10,0.25)"}} onClick={()=>signOut?.()}>🚪 Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}