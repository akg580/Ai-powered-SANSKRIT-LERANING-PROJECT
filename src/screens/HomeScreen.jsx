// src/screens/HomeScreen.jsx — Devavāṇī v5.0
// Landing screen: hero, "continue learning" card, in-progress list, chapter grid.
import { useAuth } from "../contexts/AuthContext";
import { useProgress } from "../contexts/ProgressContext";
import { ProgressBar } from "../components/ui/ProgressBar";

export function HomeScreen({chapters,onOpen}){
  const {scores,completed,totalXP,streak}=useProgress();
  const {userProfile}=useAuth();
  const firstName=(userProfile?.displayName||"").split(" ")[0]||"Scholar";
  const nextCh=chapters.find(ch=>!completed?.has?.(ch.id));
  const inProg=chapters.filter(ch=>(scores?.[ch.id]>0)&&!completed?.has?.(ch.id)).slice(0,3);
  const done=[...(completed||[])].length;
  const pct=chapters.length>0?Math.round((done/chapters.length)*100):0;
  return(
    <div style={{paddingBottom:80}}>
      <section className="hero-wrap">
        <div className="anim-fade-up">
          <span className="hero-om" aria-hidden="true">ॐ</span>
        </div>
        <div className="hero-sub anim-fade-up d1">देवभाषा — Language of the Cosmos</div>
        <h1 className="hero-title anim-fade-up d2">
          नमस्ते, <span>{firstName}</span>
        </h1>
        <p className="hero-desc anim-fade-up d3">
          Master Pāṇini's Aṣṭādhyāyī through structured chapters, 3D flashcards, and levelled quizzes.
        </p>
        <div className="stats-row anim-fade-up d4">
          {[{v:`${done}/${chapters.length}`,l:"Chapters",c:"var(--gold-vivid)"},{v:`${totalXP||0}`,l:"XP Earned",c:"var(--teal)"},{v:`🔥 ${streak||0}`,l:"Streak",c:"var(--saffron)"},{v:`${pct}%`,l:"Mastery",c:"var(--lotus)"}].map(s=>(
            <div key={s.l} className="stat-chip">
              <div className="stat-val" style={{color:s.c}}>{s.v}</div>
              <div className="stat-lbl">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="main-content" style={{paddingTop:0}}>
        <div className="content-inner" style={{maxWidth:"100%"}}>
          {nextCh&&(
            <div style={{marginBottom:28}}>
              <div className="label-caps" style={{marginBottom:10}}>Continue Learning</div>
              <button className="continue-card" style={{borderColor:nextCh.color}} onClick={()=>onOpen(nextCh)}>
                <div style={{width:46,height:46,borderRadius:12,background:`${nextCh.color}16`,border:`2px solid ${nextCh.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,transition:"transform 0.22s var(--ease-spring)"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.12) rotate(-5deg)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1) rotate(0deg)"}>{nextCh.icon}</div>
                <div style={{flex:1}}>
                  <div className="label-caps" style={{color:nextCh.color,marginBottom:3}}>Up Next</div>
                  <div style={{fontSize:15,fontWeight:700,color:"var(--text-primary)",marginBottom:2}}>{nextCh.title}</div>
                  <div style={{fontSize:12,color:"var(--text-muted)"}}>{nextCh.subtitle}</div>
                </div>
                <span style={{fontSize:20,color:nextCh.color,flexShrink:0}}>→</span>
              </button>
            </div>
          )}

          {inProg.length>0&&(
            <div style={{marginBottom:28}}>
              <div className="label-caps" style={{marginBottom:10}}>In Progress</div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {inProg.map(ch=>{
                  const s=scores?.[ch.id]||0;
                  const p=Math.round((s/ch.quiz.length)*100);
                  return(
                    <button key={ch.id} className="card card-interactive"
                      style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",border:`1.5px solid ${ch.color}33`,textAlign:"left",fontFamily:"var(--font-body)",width:"100%"}}
                      onClick={()=>onOpen(ch)}>
                      <span style={{fontSize:18,flexShrink:0}}>{ch.icon}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:"var(--text-primary)",marginBottom:5}}>{ch.title}</div>
                        <ProgressBar value={s} max={ch.quiz.length} color={ch.color} h={3}/>
                      </div>
                      <span style={{fontSize:12,color:ch.color,fontWeight:700}}>{p}%</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{marginBottom:28}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div className="label-caps">All Chapters</div>
              <span style={{fontSize:12,color:"var(--text-muted)"}}>{chapters.length} modules</span>
            </div>
            <div className="ch-grid">
              {chapters.map((ch,idx)=>{
                const isDone=completed?.has?.(ch.id);
                return(
                  <button key={ch.id}
                    className={`ch-card anim-fade-up d${Math.min(idx+1,6)}${isDone?" done":""}`}
                    style={{"--ch-accent":ch.color,background:"var(--surface-0)"}}
                    onClick={()=>onOpen(ch)}>
                    <div className="ch-card-top">
                      <div className="ch-icon-wrap" style={{background:`${ch.color}10`,borderColor:`${ch.color}30`}}>
                        <span style={{fontSize:20}}>{ch.icon}</span>
                      </div>
                      <div style={{flex:1}}>
                        <div className="ch-num" style={{color:ch.color}}>{ch.num}</div>
                        <div className="ch-title">{ch.title}</div>
                      </div>
                      {isDone&&<span style={{fontSize:14}}>✅</span>}
                    </div>
                    <div className="ch-sub">{ch.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="divider-ornament"><span>ॐ</span></div>
          <div className="section-box section-box--gold anim-fade-up" style={{padding:"20px 22px",marginBottom:28}}>
            <div className="section-header" style={{marginBottom:10}}>
              <span style={{fontFamily:"var(--font-display)",fontSize:16,fontWeight:700}}>💡 Did you know?</span>
              <span className="badge badge-gold">Pāṇini</span>
            </div>
            <div style={{fontFamily:"var(--font-dev)",fontSize:17,color:"var(--text-primary)",marginBottom:6,lineHeight:1.9}}>अष्टाध्यायी — चार हजार सूत्र</div>
            <p style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.7,margin:0}}>
              Pāṇini's Aṣṭādhyāyī contains ~4,000 sūtras averaging just 2–3 syllables each. Written ~400 BCE, it remains the most compact and complete grammatical description of any language ever produced.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}