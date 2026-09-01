// src/screens/GlossaryScreen.jsx — Devavāṇī v5.0
// Searchable, filterable index of every concept term across all chapters.
import { useState } from "react";
import { CC } from "../constants/categoryColors";
import { CatTag } from "../components/ui/CatTag";

export function GlossaryScreen({chapters,onOpen}){
  const [q,setQ]=useState("");
  const [catF,setCatF]=useState("all");
  const all=chapters.flatMap(ch=>ch.concepts.map(c=>({...c,chTitle:ch.title,chColor:ch.color,chapter:ch})));
  const cats=[...new Set(all.map(t=>t.cat))].sort();
  const filtered=all.filter(t=>{
    const mC=catF==="all"||t.cat===catF;
    const mQ=!q||t.term.toLowerCase().includes(q.toLowerCase())||t.meaning.toLowerCase().includes(q.toLowerCase());
    return mC&&mQ;
  });
  return(
    <div className="main-content">
      <div className="content-inner">
        <div style={{marginBottom:22}}>
          <div className="label-caps" style={{marginBottom:7}}>Reference</div>
          <h1 style={{fontSize:"clamp(20px,3.5vw,30px)",marginBottom:5}}>📖 Glossary</h1>
          <p style={{fontSize:13,color:"var(--text-muted)"}}>{all.length} terms · {chapters.length} chapters</p>
        </div>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search terms, meanings, sūtras…"/>
        </div>
        <div className="filter-row">
          <button className={`filter-pill${catF==="all"?" active":""}`} onClick={()=>setCatF("all")}>All</button>
          {cats.map(c=><button key={c} className={`filter-pill${catF===c?" active":""}`} onClick={()=>setCatF(c===catF?"all":c)}>{c}</button>)}
        </div>
        <div style={{fontSize:11,color:"var(--text-muted)",marginBottom:10}}>{filtered.length} results</div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {filtered.map((t,i)=>{
            const cc=CC[t.cat]||"var(--gold-vivid)";
            return(
              <button key={i} className={`gloss-item anim-fade-up d${Math.min(i+1,6)}`}
                style={{borderLeftColor:cc}} onClick={()=>onOpen(t.chapter)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:7,marginBottom:4,flexWrap:"wrap"}}>
                  <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
                    <span style={{fontFamily:"var(--font-display)",fontSize:15,fontWeight:700,color:"var(--text-primary)"}}>{t.term}</span>
                    {t.sutra&&<span style={{fontSize:10,color:"var(--text-muted)",fontFamily:"var(--font-mono)"}}>({t.sutra})</span>}
                  </div>
                  <CatTag cat={t.cat}/>
                </div>
                <div style={{fontSize:12,color:"var(--text-secondary)",marginBottom:5,lineHeight:1.6}}>{t.meaning}</div>
                <div style={{fontSize:12,color:cc,background:`${cc}0d`,padding:"3px 10px",borderRadius:6,display:"inline-block",fontFamily:"var(--font-dev)"}}>{t.example}</div>
                <div style={{fontSize:10,color:"var(--text-faint)",marginTop:5}}>→ {t.chTitle}</div>
              </button>
            );
          })}
          {filtered.length===0&&(
            <div style={{textAlign:"center",padding:"48px 24px",color:"var(--text-muted)"}}>
              <div style={{fontSize:40,marginBottom:10}}>🔍</div>
              <p>No terms match "{q}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}