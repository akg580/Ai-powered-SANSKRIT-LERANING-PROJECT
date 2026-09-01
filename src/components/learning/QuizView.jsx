// src/components/learning/QuizView.jsx — Devavāṇī v5.0
// Chapter-level multiple-choice quiz. Scoring >=75% marks the chapter mastered.
import { useState } from "react";

export function QuizView({chapter,onScore}){
  const [qi,setQi]=useState(0);
  const [sel,setSel]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const questions=chapter.quiz;
  const cur=questions[qi];

  function choose(i){ if(answered)return; setSel(i); setAnswered(true); if(i===cur.ans)setScore(s=>s+1); }
  function next(){
    const ns=score+(sel===cur.ans?1:0);
    if(qi+1>=questions.length){setDone(true);onScore?.(ns,questions.length);}
    else{setQi(q=>q+1);setSel(null);setAnswered(false);}
  }
  function reset(){setQi(0);setSel(null);setAnswered(false);setScore(0);setDone(false);}

  if(done){
    const pct=Math.round((score/questions.length)*100);
    const passed=pct>=75;
    return(
      <div className="score-wrap anim-scale-in">
        <div className="score-circle" style={{borderColor:passed?"var(--teal)":"var(--saffron)"}}>
          <div className="score-num" style={{color:passed?"var(--teal)":"var(--saffron)"}}>{pct}%</div>
          <div style={{fontSize:10,color:"var(--text-muted)",letterSpacing:"0.06em"}}>{score}/{questions.length}</div>
        </div>
        <h3 style={{fontFamily:"var(--font-display)",fontSize:22,marginBottom:8}}>{passed?"✨ Excellent!":"Keep going!"}</h3>
        <p style={{fontSize:13,color:"var(--text-muted)",marginBottom:20}}>{passed?"Chapter mastered — XP logged.":`Need ≥75%. Got ${pct}%.`}</p>
        <button className="btn btn-primary" onClick={reset}>🔄 Try again</button>
      </div>
    );
  }
  return(
    <div className="quiz-wrap anim-fade-up">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,fontSize:12,color:"var(--text-muted)"}}>
        <span style={{fontFamily:"var(--font-mono)"}}>Q {qi+1} / {questions.length}</span>
        <span className="badge badge-gold">Score: {score}</span>
      </div>
      <div style={{height:3,background:"var(--border-faint)",borderRadius:3,marginBottom:18,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${(qi/questions.length)*100}%`,background:"linear-gradient(90deg,var(--gold-mid),var(--gold-vivid))",transition:"width 0.4s",borderRadius:3}}/>
      </div>
      <div className="quiz-q">{cur.q}</div>
      <div className="quiz-opts">
        {cur.opts.map((opt,i)=>(
          <button key={i}
            className={`quiz-opt${sel===i?(i===cur.ans?" correct":" wrong"):""}${answered&&i===cur.ans&&sel!==i?" correct":""}`}
            onClick={()=>choose(i)} disabled={answered}>
            <span className="quiz-letter" style={{color:sel===i?(i===cur.ans?"var(--teal)":"var(--saffron)"):"var(--text-muted)"}}>
              {String.fromCharCode(65+i)}
            </span>
            <span style={{fontFamily:"var(--font-dev)",fontSize:14}}>{opt}</span>
          </button>
        ))}
      </div>
      {answered&&(
        <div className="quiz-exp anim-fade-in">
          <strong style={{color:sel===cur.ans?"var(--teal)":"var(--saffron)"}}>{sel===cur.ans?"✅ Correct!":"❌ Not quite."}</strong> {cur.exp}
        </div>
      )}
      {answered&&<button className="btn btn-primary btn-w" onClick={next} style={{marginTop:4}}>{qi+1>=questions.length?"See results →":"Next →"}</button>}
    </div>
  );
}