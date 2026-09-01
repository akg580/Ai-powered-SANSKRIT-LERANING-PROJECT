// src/components/learning/FlipCard.jsx — Devavāṇī v5.0
// 3D-flip flashcard: front shows the term, back reveals meaning + example.
import { useState } from "react";
import { CC } from "../../constants/categoryColors";
import { CatTag } from "../ui/CatTag";

export function FlipCard({concept,index}){
  const [flipped,setFlipped]=useState(false);
  const c=CC[concept.cat]||"var(--gold-vivid)";
  return(
    <div className="fc-wrap anim-fade-up" style={{animationDelay:`${index*0.06}s`}}
      onClick={()=>setFlipped(x=>!x)} role="button" tabIndex={0}
      onKeyDown={e=>e.key==="Enter"&&setFlipped(x=>!x)}
      aria-label={`Flashcard: ${concept.term}`}>
      <div className={`fc-inner${flipped?" flipped":""}`}>
        <div className="fc-face fc-front">
          <div className="fc-hint">tap to reveal</div>
          <div className="fc-term">{concept.term}</div>
          {concept.sutra&&<div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text-muted)",marginTop:6}}>Sūtra {concept.sutra}</div>}
          <div style={{marginTop:12,display:"flex",gap:5,justifyContent:"center",flexWrap:"wrap"}}>
            <CatTag cat={concept.cat}/>
          </div>
          <div style={{marginTop:10,fontSize:10,color:"var(--text-faint)"}}>click to flip ↺</div>
        </div>
        <div className="fc-face fc-back">
          <div className="fc-hint" style={{color:c}}>meaning</div>
          <div style={{fontSize:13,color:"var(--text-primary)",lineHeight:1.7,marginBottom:12,textAlign:"center"}}>{concept.meaning}</div>
          <div className="concept-example" style={{borderLeft:`3px solid ${c}`,fontSize:13}}>{concept.example}</div>
          <div style={{marginTop:10,fontSize:10,color:"var(--text-faint)"}}>click to flip back ↺</div>
        </div>
      </div>
    </div>
  );
}