// src/components/UserAvatar.jsx — Devavāṇī v4.0
import { useState, useRef, useEffect } from "react";
import { useAuth }     from "../contexts/AuthContext";
import { useProgress } from "../contexts/ProgressContext";

export default function UserAvatar({onNavigate,totalChapters=7}){
  const {user,userProfile,logout}=useAuth();
  const {totalXP,completed,streak,syncing}=useProgress();
  const [open,setOpen]=useState(false);
  const ref=useRef(null);

  useEffect(()=>{
    function h(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false);}
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);

  if(!user) return null;

  const initials=(userProfile?.displayName||user.email||"U").slice(0,2).toUpperCase();
  const avatarBg=userProfile?.avatarColor||"var(--gold-vivid)";
  const name=userProfile?.displayName||user.email;

  function go(page){setOpen(false);onNavigate?.(page);}

  const menuItems=[
    {icon:"👤",label:"Profile & Settings",page:"profile"},
    {icon:"📈",label:"My Progress",page:"progress"},
    {icon:"📚",label:"All Chapters",page:"chapters"},
  ];

  return(
    <div ref={ref} style={{position:"relative",flexShrink:0}}>
      {/* Avatar button */}
      <button
        onClick={()=>setOpen(o=>!o)}
        aria-label="User menu"
        aria-expanded={open}
        style={{
          width:34,height:34,borderRadius:"50%",
          background:`linear-gradient(135deg,${avatarBg},${avatarBg}99)`,
          border:`2px solid ${open?"var(--border-gold)":"var(--border-soft)"}`,
          color:"#fff",fontWeight:800,fontSize:12,
          cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:open?"var(--shadow-gold)":"var(--shadow-xs)",
          transition:"all var(--t-mid) var(--ease-spring)",
          flexShrink:0,fontFamily:"var(--font-body)",
        }}
        onMouseEnter={e=>{if(!open)e.currentTarget.style.transform="scale(1.08)";}}
        onMouseLeave={e=>{if(!open)e.currentTarget.style.transform="scale(1)";}}
      >
        {initials}
      </button>

      {/* Sync indicator dot */}
      {syncing&&(
        <span aria-label="Saving" style={{
          position:"absolute",top:-2,right:-2,
          width:8,height:8,borderRadius:"50%",
          background:"var(--gold-vivid)",
          border:"1.5px solid var(--bg-page)",
          animation:"pulse 1s ease-in-out infinite",
        }}/>
      )}

      {/* Dropdown */}
      {open&&(
        <div className="avatar-menu" role="menu">
          {/* Header */}
          <div style={{padding:"14px 14px 12px",borderBottom:"1.5px solid var(--border-soft)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{
                width:38,height:38,borderRadius:"50%",
                background:`linear-gradient(135deg,${avatarBg},${avatarBg}99)`,
                display:"flex",alignItems:"center",justifyContent:"center",
                color:"#fff",fontWeight:800,fontSize:13,flexShrink:0,
                border:"2px solid var(--border-gold)",fontFamily:"var(--font-body)",
              }}>{initials}</div>
              <div style={{minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,color:"var(--text-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name}</div>
                <div style={{fontSize:10,color:"var(--text-muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.email}</div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{padding:"10px 12px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,borderBottom:"1.5px solid var(--border-soft)"}}>
            {[
              {v:`${totalXP||0}`,l:"XP",c:"var(--gold-vivid)"},
              {v:`${completed?.size||0}/${totalChapters}`,l:"Done",c:"var(--teal)"},
              {v:`🔥${streak||0}`,l:"Streak",c:"var(--saffron)"},
            ].map(s=>(
              <div key={s.l} style={{
                textAlign:"center",padding:"7px 3px",
                background:"var(--surface-2)",borderRadius:"var(--r-sm)",
                border:"1px solid var(--border-faint)",
              }}>
                <div style={{fontSize:12,fontWeight:800,color:s.c,lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:9,color:"var(--text-faint)",letterSpacing:"0.08em",textTransform:"uppercase",marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Sync status */}
          <div style={{padding:"7px 14px",borderBottom:"1.5px solid var(--border-faint)",display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:11}}>{syncing?"⏳":"✅"}</span>
            <span style={{fontSize:11,color:syncing?"var(--gold-vivid)":"var(--teal)"}}>
              {syncing?"Saving progress…":"All progress saved"}
            </span>
          </div>

          {/* Nav items */}
          <div style={{padding:"5px 0"}}>
            {menuItems.map(m=>(
              <AvatarMenuItem key={m.page} icon={m.icon} label={m.label} onClick={()=>go(m.page)}/>
            ))}
            <div style={{height:1,background:"var(--border-faint)",margin:"4px 10px"}}/>
            <AvatarMenuItem icon="🚪" label="Sign Out" onClick={async()=>{setOpen(false);await logout?.();}} danger/>
          </div>
        </div>
      )}
    </div>
  );
}

function AvatarMenuItem({icon,label,onClick,danger}){
  const [hov,setHov]=useState(false);
  return(
    <button
      role="menuitem"
      onClick={onClick}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        width:"100%",padding:"8px 14px",
        background:hov?(danger?"var(--saffron-lt)":"var(--surface-hover)"):"transparent",
        border:"none",display:"flex",alignItems:"center",gap:9,
        cursor:"pointer",
        color:danger?"var(--saffron)":hov?"var(--text-primary)":"var(--text-secondary)",
        fontSize:13,fontWeight:500,fontFamily:"var(--font-body)",
        transition:"all var(--t-fast)",textAlign:"left",
      }}
    >
      <span style={{fontSize:14,flexShrink:0}}>{icon}</span>
      {label}
    </button>
  );
}