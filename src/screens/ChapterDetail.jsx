// src/screens/ChapterDetail.jsx — Devavāṇī v5.0
// Single-chapter view: sidebar of subchapters + 6 tabs (Learn, Flashcards,
// Quiz, Mastery, Vedic Sources, Watch).
import { useState } from "react";
import { useProgress } from "../contexts/ProgressContext";
import { CC } from "../constants/categoryColors";
import { getSubchapters } from "../utils/chapterUtils";
import { ProgressBar } from "../components/ui/ProgressBar";
import { CatTag } from "../components/ui/CatTag";
import { SutraRef } from "../components/ui/SutraRef";
import { FlipCard } from "../components/learning/FlipCard";
import { QuizView } from "../components/learning/QuizView";
import { LevelTest } from "../components/learning/LevelTest";
import { VedicView } from "../components/learning/VedicView";

export function ChapterDetail({ch,chapters,onBack,onNavigate}){
  const {scores,completed,recordScore,recordLevelBadge,addXP,levelBadges}=useProgress();
  const [tab,setTab]=useState("concepts");
  const [activeSub,setActiveSub]=useState(null);
  const isDone=completed?.has?.(ch.id);
  const chScore=scores?.[ch.id]||0;
  const subs=getSubchapters(ch);
  const chIdx=chapters.findIndex(c=>c.id===ch.id);
  const prevCh=chIdx>0?chapters[chIdx-1]:null;
  const nextCh=chIdx<chapters.length-1?chapters[chIdx+1]:null;
  const TABS=[
    {k:"concepts",label:"📖 Learn",count:ch.concepts.length},
    {k:"flashcards",label:"🎴 Flashcards",count:null},
    {k:"quiz",label:"⚡ Quiz",count:ch.quiz.length},
    {k:"test",label:"🏆 Mastery",count:null},
    {k:"vedic",label:"📜 Sources",count:ch.vedic?.length},
    {k:"watch",label:"🎬 Watch",count:null},
  ];
  function jumpTo(id){
    setTab("concepts");setActiveSub(id);
    setTimeout(()=>{ document.getElementById(`sub-${id}`)?.scrollIntoView({behavior:"smooth",block:"start"}); },80);
  }
  return(
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-label">Subchapters</div>
        {subs.map(sub=>(
          <button key={sub.id} className={`sidebar-item${activeSub===sub.id?" active":""}`} onClick={()=>jumpTo(sub.id)}>
            <span className="sidebar-item-icon" style={{color:ch.color,fontSize:10,fontFamily:"var(--font-mono)",fontWeight:700}}>{sub.id}</span>
            <span className="sidebar-item-text">{sub.title}</span>
          </button>
        ))}
        <div className="divider"/>
        <div className="sidebar-label">Navigate</div>
        {prevCh&&<button className="sidebar-item" onClick={()=>onNavigate(prevCh)}><span className="sidebar-item-icon">←</span><span className="sidebar-item-text" style={{fontSize:11}}>{prevCh.title}</span></button>}
        {nextCh&&<button className="sidebar-item" onClick={()=>onNavigate(nextCh)}><span className="sidebar-item-icon" style={{color:nextCh.color}}>→</span><span className="sidebar-item-text" style={{fontSize:11}}>{nextCh.title}</span></button>}
      </aside>
      <div className="main-content">
        <div className="content-inner">
          <div className="breadcrumb anim-fade-in">
            <button className="breadcrumb-btn" onClick={onBack}>All Chapters</button>
            <span>›</span>
            <span style={{color:ch.color,fontWeight:600}}>{ch.icon} {ch.title}</span>
          </div>
          <div className="ch-hero anim-fade-up">
            <div style={{width:54,height:54,borderRadius:"var(--r-md)",background:`${ch.color}14`,border:`2px solid ${ch.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:14,transition:"transform 0.3s var(--ease-spring)",cursor:"default"}}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.10) rotate(-5deg)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1) rotate(0deg)"}>{ch.icon}</div>
            <div className="label-caps" style={{color:ch.color,marginBottom:6}}>Chapter {ch.num}</div>
            <h1 style={{fontSize:"clamp(18px,3.5vw,28px)",marginBottom:7,lineHeight:1.2}}>{ch.title}</h1>
            <p style={{fontSize:14,color:"var(--text-muted)",marginBottom:14,maxWidth:520}}>{ch.subtitle}</p>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center",marginBottom:14}}>
              <span className="badge badge-gold">📚 {ch.concepts.length} concepts</span>
              <span className="badge badge-teal">❓ {ch.quiz.length} questions</span>
              {isDone&&<span className="badge badge-teal">✅ Mastered</span>}
              {chScore>0&&<span className="badge badge-gold">+{chScore*15} XP</span>}
            </div>
            {chScore>0&&<div style={{maxWidth:300}}><ProgressBar value={chScore} max={ch.quiz.length} color={ch.color} h={4}/></div>}
          </div>

          <div className="sub-pills">
            {subs.map(sub=>(
              <button key={sub.id}
                className={`sub-pill${activeSub===sub.id?" active":""}`}
                onClick={()=>jumpTo(sub.id)}
                style={activeSub===sub.id?{background:`${ch.color}12`,borderColor:`${ch.color}55`,color:ch.color}:{}}>
                <span style={{fontSize:10,fontFamily:"var(--font-mono)",fontWeight:700,color:ch.color}}>{sub.id}</span>
                {sub.title}
              </button>
            ))}
          </div>

          <div className="tab-bar">
            {TABS.map(t=>(
              <button key={t.k} className={`tab-btn${tab===t.k?" active":""}`}
                onClick={()=>setTab(t.k)}
                style={tab===t.k?{color:ch.color,borderBottomColor:ch.color,background:`${ch.color}0d`}:{}}>
                {t.label}
                {t.count!=null&&<span style={{fontSize:10,background:"var(--surface-2)",padding:"1px 6px",borderRadius:"99px",marginLeft:4}}>{t.count}</span>}
              </button>
            ))}
          </div>

          {tab==="concepts"&&(
            <div style={{display:"flex",flexDirection:"column",gap:36}}>
              {subs.map((sub,si)=>(
                <section key={sub.id} id={`sub-${sub.id}`} className="sub-section">
                  <div className="sub-section-head">
                    <span className="sub-badge" style={{background:`${ch.color}10`,color:ch.color,borderColor:`${ch.color}44`}}>{sub.id}</span>
                    <div>
                      <h2 style={{fontSize:18,margin:0}}>{sub.title}</h2>
                      <div style={{fontSize:11,color:"var(--text-faint)",marginTop:2}}>Subchapter {sub.id}</div>
                    </div>
                  </div>
                  {(()=>{
                    const c=sub.concept;
                    const cc=CC[c.cat]||"var(--gold-vivid)";
                    return(
                      <div className="concept-card anim-fade-up" style={{borderLeftColor:cc}}
                        onMouseEnter={e=>{e.currentTarget.style.borderLeftWidth="5px";}}
                        onMouseLeave={e=>{e.currentTarget.style.borderLeftWidth="3px";}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:7,marginBottom:8}}>
                          <h3 className="concept-term">{c.term}</h3>
                          <div style={{display:"flex",gap:5,flexShrink:0,flexWrap:"wrap"}}>
                            <CatTag cat={c.cat}/><SutraRef sutra={c.sutra}/>
                          </div>
                        </div>
                        <p className="concept-meaning">{c.meaning}</p>
                        <div className="concept-example">{c.example}</div>
                      </div>
                    );
                  })()}
                </section>
              ))}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10,marginTop:8}}>
                <button className="card card-interactive" style={{padding:"14px 16px",textAlign:"left",border:"none",cursor:prevCh?"pointer":"not-allowed",opacity:prevCh?1:0.4,fontFamily:"var(--font-body)"}}
                  disabled={!prevCh} onClick={()=>prevCh&&onNavigate(prevCh)}>
                  <div className="label-caps" style={{marginBottom:5}}>← Previous</div>
                  <div style={{fontSize:13,fontWeight:700}}>{prevCh?`${prevCh.icon} ${prevCh.title}`:"Start of course"}</div>
                </button>
                <button className="card card-interactive" style={{padding:"14px 16px",textAlign:"left",border:`1.5px solid ${nextCh?.color||"var(--border-soft)"}44`,cursor:nextCh?"pointer":"not-allowed",opacity:nextCh?1:0.4,fontFamily:"var(--font-body)"}}
                  disabled={!nextCh} onClick={()=>nextCh&&onNavigate(nextCh)}>
                  <div className="label-caps" style={{color:nextCh?.color||"var(--text-muted)",marginBottom:5}}>Next →</div>
                  <div style={{fontSize:13,fontWeight:700}}>{nextCh?`${nextCh.icon} ${nextCh.title}`:"Course complete! 🎉"}</div>
                </button>
              </div>
            </div>
          )}

          {tab==="flashcards"&&(
            <div>
              <p style={{color:"var(--text-muted)",fontSize:13,marginBottom:18}}>Click any card to flip and reveal the meaning.</p>
              <div className="fc-grid">{ch.concepts.map((c,i)=><FlipCard key={i} concept={c} index={i}/>)}</div>
            </div>
          )}

          {tab==="quiz"&&(
            <div>
              <p style={{color:"var(--text-muted)",fontSize:13,marginBottom:18}}>Score ≥75% to mark chapter as mastered.</p>
              <div className="section-box">
                <QuizView chapter={ch} onScore={(s,t)=>recordScore?.(ch.id,s,t)}/>
              </div>
            </div>
          )}

          {tab==="test"&&(
            <div className="section-box">
              <LevelTest chapter={ch} onXP={addXP} levelBadges={levelBadges} onBadge={recordLevelBadge}/>
            </div>
          )}

          {tab==="vedic"&&(
            <div>
              <p style={{color:"var(--text-muted)",fontSize:13,marginBottom:18}}>Vedic sūtras and verses connecting grammar to sacred tradition.</p>
              <VedicView vedic={ch.vedic}/>
            </div>
          )}

          {tab==="watch"&&(
            <div className="section-box" style={{textAlign:"center",padding:"44px 28px"}}>
              <div style={{fontSize:52,marginBottom:14}}>📺</div>
              <h3 style={{fontFamily:"var(--font-display)",fontSize:24,marginBottom:8}}>Watch: {ch.title}</h3>
              <p style={{fontSize:14,color:"var(--text-muted)",lineHeight:1.75,marginBottom:24,maxWidth:420,margin:"0 auto 24px"}}>
                Lectures by <strong style={{color:"var(--gold-vivid)"}}>Pushpa Dikshit</strong> · Aṣṭādhyāyī Sahajabodha series · Pauspi Prakriyā method
              </p>
              <a href="https://youtube.com/playlist?list=PLi40Uu5ziQ7YnTssjlmllhSyP63LC1FXs"
                target="_blank" rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                style={{textDecoration:"none",background:"linear-gradient(135deg,#FF0000,#CC0000)",boxShadow:"0 4px 20px rgba(255,0,0,0.22)"}}>
                ▶ Open YouTube Playlist
              </a>
              <div style={{marginTop:22,fontFamily:"var(--font-dev)",color:"var(--gold-vivid)",fontSize:20,opacity:0.65}}>ॐ पाणिनये नमः</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}