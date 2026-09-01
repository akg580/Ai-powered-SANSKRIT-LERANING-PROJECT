// src/components/learning/VedicView.jsx — Devavāṇī v5.0
// Lists Vedic/epic source verses connected to a chapter's grammar concepts.

export function VedicView({vedic}){
  if(!vedic?.length) return(
    <div style={{textAlign:"center",padding:"48px 24px",color:"var(--text-muted)"}}>
      <div style={{fontSize:44,marginBottom:12}}>📜</div>
      <p>No Vedic sources for this chapter yet.</p>
    </div>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {vedic.map((v,i)=>(
        <div key={i} className={`vedic-card anim-fade-up d${i+1}`}>
          <div className="vedic-dev">{v.dev}</div>
          <div className="vedic-roman">{v.roman}</div>
          <div className="vedic-trans">"{v.trans}"</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:v.rel?10:0}}>
            <span className="vedic-source">📚 {v.source}</span>
          </div>
          {v.rel&&<div className="vedic-conn">💡 {v.rel}</div>}
        </div>
      ))}
    </div>
  );
}