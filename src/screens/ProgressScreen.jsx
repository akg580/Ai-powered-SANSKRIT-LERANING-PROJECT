// src/screens/ProgressScreen.jsx — Devavāṇī v5.0
// XP, streak, and per-chapter mastery overview.
import { useProgress } from "../contexts/ProgressContext";
import { ProgressBar } from "../components/ui/ProgressBar";

export function ProgressScreen({chapters,onOpen}){
  const {scores,completed,totalXP,streak,syncing}=useProgress();
  const tc=chapters.length;
  const donePct=tc>0?Math.round(((completed?.size||0)/tc)*100):0;
  return(
    <div className="main-content">
      <div className="content-inner">
        <div style={{marginBottom:22}}>
          <div className="label-caps" style={{marginBottom:7}}>Your Journey</div>
          <h1 style={{fontSize:"clamp(20px,3.5vw,30px)",marginBottom:5}}>📈 Progress</h1>
          <div style={{fontSize:12,color:syncing?"var(--gold-vivid)":"var(--teal)"}}>{syncing?"⏳ Saving…":"✅ All progress saved"}</div>
        </div>
        <div className="prog-hero anim-fade-up">
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:20}}>
            {[{v:`${completed?.size||0}/${tc}`,l:"Chapters",c:"var(--gold-vivid)"},{v:`${totalXP||0} XP`,l:"Experience",c:"var(--teal)"},{v:`🔥 ${streak||0}`,l:"Streak",c:"var(--saffron)"},{v:`${donePct}%`,l:"Mastery",c:"var(--lotus)"}].map(s=>(
              <div key={s.l} className="stat-chip"><div className="stat-val" style={{color:s.c}}>{s.v}</div><div className="stat-lbl">{s.l}</div></div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}>
            <span style={{fontWeight:600}}>Overall Mastery</span>
            <span style={{color:"var(--gold-vivid)",fontWeight:700}}>{donePct}%</span>
          </div>
          <div className="pbar" style={{height:8}}><div className="pbar-fill" style={{width:`${donePct}%`,height:8}}/></div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {chapters.map(ch=>{
            const s=scores?.[ch.id]||0;
            const done=completed?.has?.(ch.id);
            const pct=ch.quiz.length>0?Math.round((s/ch.quiz.length)*100):0;
            return(
              <button key={ch.id} className="card card-interactive"
                style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",border:`1.5px solid ${done?ch.color+"55":"var(--border-soft)"}`,textAlign:"left",width:"100%",fontFamily:"var(--font-body)"}}
                onClick={()=>onOpen(ch)}>
                <span style={{fontSize:20,flexShrink:0}}>{ch.icon}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,gap:7}}>
                    <span style={{fontSize:13,fontWeight:600,color:"var(--text-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ch.title}</span>
                    <span style={{fontSize:12,color:ch.color,fontWeight:700,flexShrink:0}}>{pct}%</span>
                  </div>
                  <ProgressBar value={s} max={ch.quiz.length} color={ch.color} h={3}/>
                  <div style={{fontSize:10,color:"var(--text-faint)",marginTop:3}}>{s}/{ch.quiz.length} questions · {s*15}XP</div>
                </div>
                {done&&<span style={{fontSize:16,flexShrink:0}}>✅</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}