// src/app/layout.tsx

import React from "react";
import "../globals.css"; // Assuming globals.css is in src/app

// Ensure the correct path to the Chat component
import Chat from "../components/Chat";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header style={{ padding: "1rem", background: "#333", color: "#fff" }}>
        <h1>VesselIQ Chatbot</h1>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
      <footer style={{ padding: "1rem", background: "#333", color: "#fff", textAlign: "center" }}>
        © 2023 VesselIQ
      </footer>
    </div>
  );
};

export default Layout;
