// src/components/ui/CatTag.jsx — Devavāṇī v5.0
// Small pill labelling a concept's grammatical category (colour-coded).
import { CC } from "../../constants/categoryColors";

export function CatTag({cat}){
  const c=CC[cat]||"var(--gold-vivid)";
  return <span className="tag" style={{color:c,borderColor:`${c}44`,background:`${c}10`,fontSize:9}}>{cat}</span>;
}