// src/screens/ChaptersScreen.jsx — Devavāṇī v5.0
// Grid of all chapters with per-chapter progress.
import { useProgress } from "../contexts/ProgressContext";
import { getSubchapters } from "../utils/chapterUtils";
import { ProgressBar } from "../components/ui/ProgressBar";

export function ChaptersScreen({chapters,onOpen}){
  const {scores,completed}=useProgress();
  return(
    <div className="main-content">
      <div className="content-inner" style={{maxWidth:"100%"}}>
        <div style={{marginBottom:24}}>
          <div className="label-caps" style={{marginBottom:7}}>Curriculum</div>
          <h1 style={{fontSize:"clamp(22px,4vw,32px)",marginBottom:7}}>All Chapters</h1>
          <p style={{fontSize:14,color:"var(--text-muted)"}}>{chapters.length} modules · Pushpa Dikshit's Aṣṭādhyāyī Sahajabodha · Pauspi Prakriyā method</p>
        </div>
        <div className="ch-grid">
          {chapters.map((ch,idx)=>{
            const done=completed?.has?.(ch.id);
            const cs=scores?.[ch.id]||0;
            const subs=getSubchapters(ch);
            return(
              <button key={ch.id}
                className={`ch-card anim-fade-up d${Math.min(idx+1,6)}${done?" done":""}`}
                style={{"--ch-accent":ch.color,background:"var(--surface-0)"}}
                onClick={()=>onOpen(ch)}>
                <div className="ch-card-top">
                  <div className="ch-icon-wrap" style={{background:`${ch.color}10`,borderColor:`${ch.color}30`}}>
                    <span style={{fontSize:20}}>{ch.icon}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div className="ch-num" style={{color:ch.color}}>{ch.num} — Chapter {ch.id}</div>
                    <div className="ch-title">{ch.title}</div>
                  </div>
                  {done&&<span style={{fontSize:16,flexShrink:0}}>✅</span>}
                </div>
                <div className="ch-sub">{ch.subtitle}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4,margin:"10px 0"}}>
                  {subs.slice(0,4).map(s=>(
                    <span key={s.id} className="tag" style={{color:ch.color,borderColor:`${ch.color}33`,background:`${ch.color}0c`,fontSize:9}}>{s.id}</span>
                  ))}
                  {subs.length>4&&<span className="tag" style={{color:"var(--text-muted)",borderColor:"var(--border-faint)",background:"var(--surface-1)",fontSize:9}}>+{subs.length-4}</span>}
                </div>
                <div className="ch-footer">
                  <span>📚 {ch.concepts.length}</span>
                  <span>❓ {ch.quiz.length} Qs</span>
                  {cs>0&&<span style={{color:ch.color,fontWeight:700}}>🏅 {cs*15}XP</span>}
                </div>
                {cs>0&&<div style={{marginTop:10}}><ProgressBar value={cs} max={ch.quiz.length} color={ch.color} h={3}/></div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}