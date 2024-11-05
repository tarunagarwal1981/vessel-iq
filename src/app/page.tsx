"use client";

// page.tsx

import { useState } from "react";
import Chat from "@/components/Chat";

export default function HomePage() {
  const [response, setResponse] = useState<string>("");

  const styles = {
    container: {
      display: "flex",
      flexDirection: "row" as const,
      justifyContent: "space-between",
      alignItems: "flex-start",
      height: "100vh",
      width: "100%",
      backgroundColor: "#132337",
      color: "#f4f4f4",
      fontFamily: "Nunito, sans-serif",
      padding: "20px",
      fontSize: "12px",
    },
    responseSection: {
      width: "65%",
      padding: "20px",
      backgroundColor: "#132337",
      borderRadius: "8px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      color: "#f4f4f4",
      border: "1px solid #f4f4f4",
      overflowY: "auto" as const,
    },
    chatSection: {
      width: "30%",
      padding: "20px",
      backgroundColor: "#1f2d40",
      borderRadius: "8px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      color: "#f4f4f4",
      border: "1px solid #f4f4f4",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "space-between",
      alignItems: "center",
    },
    chatTitle: {
      marginBottom: "10px",
      fontWeight: "bold" as const,
      fontSize: "18px",
    },
    responseTitle: {
      fontSize: "18px",
      fontWeight: "bold" as const,
    },
    responseText: {
      marginTop: "20px",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Left side for displaying responses */}
      <div style={styles.responseSection}>
        <h2 style={styles.responseTitle}>VesselIQ Response</h2>
        <p>Welcome to VesselIQ! You can ask about:</p>
        <ul>
          <li>Vessel performance scores</li>
          <li>Hull condition analysis</li>
          <li>Speed consumption profiles</li>
          <li>Crew performance metrics</li>
          <li>Engine troubleshooting</li>
        </ul>
        <div style={styles.responseText}>{response}</div>
      </div>

      {/* Right side for chatbot input */}
      <div style={styles.chatSection}>
        <h2 style={styles.chatTitle}>Ask VesselIQ</h2>
        <Chat setResponse={setResponse} />
      </div>
    </div>
  );
}
