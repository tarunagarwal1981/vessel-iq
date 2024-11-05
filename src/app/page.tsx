// page.tsx
"use client";

import { useState } from "react";
import Chat from "./Chat";

export default function HomePage() {
  const [response, setResponse] = useState("");

  return (
    <div style={styles.container}>
      {/* Left side for answers */}
      <div style={styles.answerSection}>
        <h2>Answers</h2>
        <div style={styles.responseBox}>
          {response || "Your answers will appear here."}
        </div>
      </div>

      {/* Right side for chatbot input */}
      <div style={styles.chatSection}>
        <h2>Chatbot</h2>
        <Chat setResponse={setResponse} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#132337",
    color: "#f4f4f4",
    fontFamily: "Nunito, sans-serif",
  },
  answerSection: {
    flex: 1,
    padding: "20px",
    borderRight: "1px solid #f4f4f4",
    fontSize: "12px",
  },
  responseBox: {
    marginTop: "20px",
    whiteSpace: "pre-wrap",
  },
  chatSection: {
    width: "30%",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    backgroundColor: "#1a2a3d",
    boxShadow: "inset -4px 0 6px rgba(0, 0, 0, 0.2)",
  },
};
