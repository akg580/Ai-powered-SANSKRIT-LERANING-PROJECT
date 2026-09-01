// src/main.jsx — Devavāṇī v5.0
import React from "react";
import ReactDOM from "react-dom/client";
import App, { CHAPTERS } from "./App.jsx";
import { AuthProvider }     from "./contexts/AuthContext.jsx";
import { ProgressProvider } from "./contexts/ProgressContext.jsx";
import { CMSProvider }      from "./contexts/CMSContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CMSProvider defaultChapters={CHAPTERS}>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </CMSProvider>
    </AuthProvider>
  </React.StrictMode>
);