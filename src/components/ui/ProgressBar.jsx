// src/components/ui/ProgressBar.jsx — Devavāṇī v5.0
// Thin, colour-tinted progress bar used across chapter cards and screens.

export function ProgressBar({value,max,color,h=5}){
  const pct=max>0?Math.min(100,Math.round((value/max)*100)):0;
  return(<div className="pbar" style={{height:h}}>
    <div className="pbar-fill pbar-fill--static" style={{width:`${pct}%`,height:h,background:`linear-gradient(90deg,${color}88,${color})`}}/>
  </div>);
}