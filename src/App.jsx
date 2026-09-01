// src/App.jsx — Devavāṇī v5.0
// Thin application shell: routing between screens + top/bottom navigation.
// All screen bodies, learning widgets, and chapter data now live in their
// own modules (see src/screens, src/components, src/data) — this file only
// wires them together.
import { useState } from "react";
import { useAuth }     from "./contexts/AuthContext";
import { useProgress } from "./contexts/ProgressContext";
import { useCMS }      from "./contexts/CMSContext";

import { CHAPTERS } from "./data/chapters";
import { useTheme }  from "./hooks/useTheme";

import { ThemeToggle } from "./components/ui/ThemeToggle";
import AuthScreen      from "./components/AuthScreen";
import LoadingScreen   from "./components/LoadingScreen";
import UserAvatar      from "./components/UserAvatar";
import AdminPanel      from "./components/AdminPanel";

import { HomeScreen }     from "./screens/HomeScreen";
import { ChaptersScreen } from "./screens/ChaptersScreen";
import { ChapterDetail }  from "./screens/ChapterDetail";
import { ProgressScreen } from "./screens/ProgressScreen";
import { GlossaryScreen } from "./screens/GlossaryScreen";
import { ProfileScreen }  from "./screens/ProfileScreen";

import "./styles.css";

// Re-export CHAPTERS so main.jsx can seed the CMS with bundled data
// without needing to know the new internal file layout.
export { CHAPTERS };

export default function App(){
  const {user,loading:authLoading,userProfile}=useAuth();
  const {loaded:progressLoaded}=useProgress();
  const cms=useCMS();
  const {theme,toggle:toggleTheme}=useTheme();
  const [nav,setNav]=useState("home");
  const [activeChap,setActiveChap]=useState(null);
  const [sidebarOpen,setSidebarOpen]=useState(false);

  if(authLoading||(user&&!progressLoaded))
    return <LoadingScreen message={authLoading?"Checking account…":"Loading progress…"}/>;
  if(!user) return <AuthScreen/>;

  const chapters = (cms?.chapters?.length ? cms.chapters : CHAPTERS);
  const canManageContent = userProfile?.role==="admin" || userProfile?.role==="editor";

  function openChapter(ch){setActiveChap(ch);setNav("chapter");setSidebarOpen(false);}
  function goTo(page){setNav(page);if(page!=="chapter")setActiveChap(null);setSidebarOpen(false);}

  const activeChapter=activeChap?chapters.find(c=>c.id===activeChap.id)||activeChap:null;

  const NAV=[
    {id:"home",  icon:"🏠",label:"Home"},
    {id:"chapters",icon:"📚",label:"Chapters"},
    {id:"progress",icon:"📈",label:"Progress"},
    {id:"glossary",icon:"📖",label:"Glossary"},
    {id:"profile", icon:"👤",label:"Profile"},
  ];

  if(nav==="admin"){
    if(!canManageContent){ setNav("home"); return null; }
    return <AdminPanel onClose={()=>goTo("home")}/>;
  }

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <nav className="top-nav" aria-label="Primary navigation">
        <button className="nav-brand" onClick={()=>goTo("home")} aria-label="Go home">
          <div className="nav-brand-icon">🕉️</div>
          <div>
            <div className="nav-brand-name">Devavāṇī</div>
            <div className="nav-brand-tagline">Sanskrit · Pāṇini · Aṣṭādhyāyī</div>
          </div>
        </button>

        <ul className="nav-links" role="list">
          {NAV.map(n=>(
            <li key={n.id}>
              <button
                className={`nav-link${(nav===n.id||(nav==="chapter"&&n.id==="chapters"))?" active":""}`}
                onClick={()=>goTo(n.id)}
                aria-current={nav===n.id?"page":undefined}>
                <span>{n.icon}</span>{n.label}
              </button>
            </li>
          ))}
        </ul>

        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {canManageContent && (
            <button
              className="theme-toggle-single"
              onClick={()=>goTo("admin")}
              aria-label="Open content manager"
              title="Content Manager (CMS)"
            >⚙️</button>
          )}

          <ThemeToggle theme={theme} onToggle={toggleTheme}/>
          <UserAvatar totalChapters={chapters.length} onNavigate={goTo}/>

          <button
            className="menu-btn btn btn-icon btn-ghost"
            aria-label="Open menu"
            onClick={()=>setSidebarOpen(x=>!x)}
            style={{display:"none",fontSize:18,padding:"7px 10px"}}>
            ☰
          </button>
        </div>
      </nav>

      {sidebarOpen&&(
        <div className="sidebar-overlay" onClick={()=>setSidebarOpen(false)} aria-hidden="true"/>
      )}

      {sidebarOpen&&(
        <div className="sidebar open" style={{zIndex:160,paddingTop:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 10px 10px"}}>
            <div className="sidebar-label" style={{padding:0}}>Navigation</div>
            <button onClick={()=>setSidebarOpen(false)}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"var(--text-muted)",padding:0}}>✕</button>
          </div>
          {NAV.map(n=>(
            <button key={n.id}
              className={`sidebar-item${nav===n.id?" active":""}`}
              onClick={()=>goTo(n.id)}>
              <span className="sidebar-item-icon">{n.icon}</span>
              <span className="sidebar-item-text">{n.label}</span>
            </button>
          ))}
          {canManageContent && (
            <button className="sidebar-item" onClick={()=>goTo("admin")}>
              <span className="sidebar-item-icon">⚙️</span>
              <span className="sidebar-item-text">Content Manager</span>
            </button>
          )}
          <div className="divider"/>
          <div style={{padding:"4px 10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div className="sidebar-label" style={{padding:0}}>Theme</div>
            <ThemeToggle theme={theme} onToggle={toggleTheme}/>
          </div>
        </div>
      )}

      <main style={{flex:1}}>
        {nav==="home"     &&<HomeScreen chapters={chapters} onOpen={openChapter}/>}
        {nav==="chapters" &&!activeChap&&<ChaptersScreen chapters={chapters} onOpen={openChapter}/>}
        {nav==="chapter"  &&activeChapter&&(
          <ChapterDetail
            key={activeChapter.id}
            ch={activeChapter}
            chapters={chapters}
            onBack={()=>goTo("chapters")}
            onNavigate={openChapter}/>
        )}
        {nav==="progress" &&<ProgressScreen chapters={chapters} onOpen={openChapter}/>}
        {nav==="glossary" &&<GlossaryScreen chapters={chapters} onOpen={openChapter}/>}
        {nav==="profile"  &&<ProfileScreen chapters={chapters}/>}
      </main>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        <div className="bottom-nav-inner">
          {NAV.map(n=>(
            <button key={n.id}
              className={`bnav-btn${(nav===n.id||(nav==="chapter"&&n.id==="chapters"))?" active":""}`}
              onClick={()=>goTo(n.id)}
              aria-current={nav===n.id?"page":undefined}>
              <span className="bi">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}