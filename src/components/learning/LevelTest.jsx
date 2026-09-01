// src/components/learning/LevelTest.jsx — Devavāṇī v5.0
// Easy/Medium/Hard mastery test; awards XP and a badge per difficulty level.
import { useState } from "react";

export function LevelTest({chapter,onXP,levelBadges,onBadge}){
  const [level,setLevel]=useState(null);
  const [qi,setQi]=useState(0);
  const [sel,setSel]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const questions=level?(chapter.levels?.[level]||[]):[];
  const cur=questions[qi];
  const xpMap={easy:10,medium:20,hard:40};
  const colorMap={easy:"var(--teal)",medium:"var(--gold-vivid)",hard:"var(--saffron)"};

  function choose(i){if(answered)return;setSel(i);setAnswered(true);if(i===cur.ans)setScore(s=>s+1);}
  function next(){
    const ns=score+(sel===cur.ans?1:0);
    if(qi+1>=questions.length){setDone(true);onXP?.(ns*xpMap[level]);onBadge?.(chapter.id,level);}
    else{setQi(q=>q+1);setSel(null);setAnswered(false);}
  }
  function reset(){setLevel(null);setQi(0);setSel(null);setAnswered(false);setScore(0);setDone(false);}

  if(!level){
    const lvls=[
      {id:"easy",icon:"🌱",name:"Beginner",xp:xpMap.easy,color:"var(--teal)",q:chapter.levels?.easy?.length||0},
      {id:"medium",icon:"⚡",name:"Intermediate",xp:xpMap.medium,color:"var(--gold-vivid)",q:chapter.levels?.medium?.length||0},
      {id:"hard",icon:"🔥",name:"Advanced",xp:xpMap.hard,color:"var(--saffron)",q:chapter.levels?.hard?.length||0},
    ];
    return(
      <div className="anim-fade-up">
        <div style={{marginBottom:18}}>
          <h3 style={{fontFamily:"var(--font-display)",fontSize:20,marginBottom:5}}>🏆 Mastery Test</h3>
          <p style={{fontSize:13,color:"var(--text-muted)"}}>Choose difficulty to earn XP and unlock a badge.</p>
        </div>
        <div className="level-grid">
          {lvls.map(l=>{
            const earned=levelBadges?.[chapter.id]?.includes(l.id);
            return(
              <button key={l.id} className={`level-card${earned?" earned":""}`}
                style={{"--accent-color":`${l.color}14`}}
                onClick={()=>l.q>0&&setLevel(l.id)}>
                <div className="level-icon">{earned?"🥇":l.icon}</div>
                <div className="level-name" style={{color:l.color}}>{l.name}</div>
                <div className="level-desc">{l.q} questions · {l.xp}XP each</div>
                {earned&&<div style={{fontSize:10,color:l.color,fontWeight:700,marginTop:6}}>Badge earned ✓</div>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  if(done){
    const xp=score*xpMap[level];
    return(
      <div className="score-wrap anim-scale-in">
        <div className="score-circle" style={{borderColor:colorMap[level]}}>
          <div className="score-num" style={{color:colorMap[level]}}>{xp}</div>
          <div style={{fontSize:10,color:"var(--text-muted)",letterSpacing:"0.08em",textTransform:"uppercase"}}>XP Earned</div>
        </div>
        <h3 style={{fontFamily:"var(--font-display)",fontSize:22,marginBottom:8}}>
          🥇 {level.charAt(0).toUpperCase()+level.slice(1)} Badge!
        </h3>
        <p style={{fontSize:13,color:"var(--text-muted)",marginBottom:20}}>{score}/{questions.length} correct</p>
        <button className="btn btn-ghost btn-sm" onClick={reset}>Try another level</button>
      </div>
    );
  }
  return(
    <div className="quiz-wrap anim-fade-up">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <button className="btn btn-ghost btn-sm" onClick={reset}>← Back</button>
        <span style={{fontSize:12,color:"var(--text-muted)",fontFamily:"var(--font-mono)"}}>{level} · Q{qi+1}/{questions.length}</span>
      </div>
      <div className="quiz-q">{cur.q}</div>
      <div className="quiz-opts">
        {cur.opts.map((opt,i)=>(
          <button key={i}
            className={`quiz-opt${sel===i?(i===cur.ans?" correct":" wrong"):""}${answered&&i===cur.ans&&sel!==i?" correct":""}`}
            onClick={()=>choose(i)} disabled={answered}>
            <span className="quiz-letter">{String.fromCharCode(65+i)}</span>
            <span style={{fontFamily:"var(--font-dev)",fontSize:14}}>{opt}</span>
          </button>
        ))}
      </div>
      {answered&&<div className="quiz-exp anim-fade-in"><strong style={{color:sel===cur.ans?"var(--teal)":"var(--saffron)"}}>{sel===cur.ans?"✅ Correct!":"❌ Not quite."}</strong> {cur.exp}</div>}
      {answered&&<button className="btn btn-primary btn-w" onClick={next} style={{marginTop:4}}>{qi+1>=questions.length?"Finish →":"Next →"}</button>}
    </div>
  );
}