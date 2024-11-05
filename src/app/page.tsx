// src/app/page.tsx
"use client";
import { useState } from "react";
import Chat from "../components/Chat";

export default function HomePage() {
  const [response, setResponse] = useState<string>("");

  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#132337",
      color: "#f4f4f4",
      fontFamily: "Nunito, sans-serif",
    },
    responseSection: {
      width: "70%",
      padding: "2rem",
      fontSize: "1rem",
      borderRight: "1px solid #f4f4f4",
      overflowY: "auto" as "auto",
    },
    chatSection: {
      width: "30%",
      padding: "2rem",
      display: "flex",
      flexDirection: "column" as "column",
      justifyContent: "center",
      backgroundColor: "#1f4068",
      boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.3)",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.responseSection}>
        <h2>Chatbot Response</h2>
        <p>{response}</p>
      </div>
      <div style={styles.chatSection}>
        <h2>Chatbot</h2>
        <Chat setResponse={setResponse} />
      </div>
    </div>
  );
}
