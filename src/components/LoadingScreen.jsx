// src/components/LoadingScreen.jsx
export default function LoadingScreen({ message = "Loading…" }) {
  return (
    <div className="loading-screen" style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#FDF6E3,#F0E6C8 50%,#FDF6E3)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Trebuchet MS',Verdana,sans-serif",
    }}>
      {/* Spinning Om */}
      <div className="loading-mark" style={{
        width: 70, height: 70, borderRadius: "50%",
        background: "linear-gradient(135deg,#B8860B,#D4A843)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32, marginBottom: 18,
        animation: "spin 2s linear infinite",
        boxShadow: "0 8px 28px rgba(184,134,11,0.4)",
      }}>🕉️</div>

      <div style={{
        fontFamily: "'Palatino Linotype',Georgia,serif",
        fontSize: 18, fontWeight: 700, color: "#2C1A0E", marginBottom: 6,
      }}>Aṣṭādhyāyī Sahajabodha</div>

      <div style={{ fontSize: 13, color: "#A08850", marginBottom: 20 }}>{message}</div>

      {/* Three dots */}
      <div style={{ display: "flex", gap: 8 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%", background: "#B8860B",
            animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
          }}/>
        ))}
      </div>

      <style>{`
        @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-8px);opacity:1} }
      `}</style>
    </div>
  );
}
