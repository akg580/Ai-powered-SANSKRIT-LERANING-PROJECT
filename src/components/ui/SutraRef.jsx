// src/components/ui/SutraRef.jsx — Devavāṇī v5.0
// Renders a small "📜 1.1.1" badge citing the Aṣṭādhyāyī sūtra reference.

export function SutraRef({sutra}){
  if(!sutra) return null;
  return <span className="sutra-ref">📜 {sutra}</span>;
}