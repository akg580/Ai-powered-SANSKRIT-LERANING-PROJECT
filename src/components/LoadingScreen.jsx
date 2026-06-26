// src/components/LoadingScreen.jsx — Devavāṇī v4.0
export default function LoadingScreen({message="Loading your Sanskrit journey…"}){
  return(
    <div className="loading-screen">
      <div className="loading-om" role="img" aria-label="Om symbol">ॐ</div>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:"var(--font-display)",fontSize:20,fontWeight:700,color:"var(--text-primary)",marginBottom:4}}>
          Devavāṇī
        </div>
        <div style={{fontSize:13,color:"var(--text-muted)"}}>{message}</div>
      </div>
      <div className="loading-dots" aria-hidden="true">
        {[0,1,2].map(i=>(
          <div key={i} className="loading-dot" style={{animationDelay:`${i*0.2}s`}}/>
        ))}
      </div>
    </div>
  );
}