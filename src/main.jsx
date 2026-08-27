// src/main.jsx — Devavāṇī v4.1
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider }     from "./contexts/AuthContext.jsx";
import { ProgressProvider } from "./contexts/ProgressContext.jsx";
import { CMSProvider }      from "./contexts/CMSContext.jsx";

// Import the bundled chapter data so CMSProvider can seed from it
import { CHAPTERS } from "./chapters.js";

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