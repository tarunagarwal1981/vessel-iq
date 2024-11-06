// src/app/layout.tsx

"use client"; // This tells Next.js to treat this file as a Client Component

import React, { useState } from "react";
import "../globals.css";
import Chat from "../components/Chat";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isChatVisible, setIsChatVisible] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header style={{ padding: "1rem", background: "#333", color: "#fff" }}>
        <h1>VesselIQ Chatbot</h1>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
      <footer style={{ padding: "1rem", background: "#333", color: "#fff", textAlign: "center" }}>
        © 2023 VesselIQ
      </footer>
      <div className="chat-button" onClick={() => setIsChatVisible(!isChatVisible)}>
        <span></span>
      </div>
      {isChatVisible && <Chat closeChat={() => setIsChatVisible(false)} />}
    </div>
  );
};

export default Layout;
