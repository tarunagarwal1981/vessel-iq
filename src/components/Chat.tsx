// Chat.tsx
"use client";

import { useState } from "react";

export default function Chat({ setResponse }) {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message) return;

    // Call your API to get the response
    try {
      const apiResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: message }),
      });

      const data = await apiResponse.json();
      setResponse(data.answer); // Set response in the parent component
      setMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <div style={styles.chatBox}>
      <input
        type="text"
        placeholder="Type your message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleSend} style={styles.sendButton}>
        <span role="img" aria-label="send">
          ➤
        </span>
      </button>
    </div>
  );
}

const styles = {
  chatBox: {
    display: "flex",
    alignItems: "center",
    marginTop: "auto",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#2a3b4d",
    boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.3)",
  },
  input: {
    flex: 1,
    border: "none",
    padding: "8px",
    backgroundColor: "transparent",
    color: "#f4f4f4",
    outline: "none",
  },
  sendButton: {
    backgroundColor: "#132337",
    color: "#f4f4f4",
    padding: "8px 12px",
    border: "none",
    cursor: "pointer",
    boxShadow: "1px 1px 4px rgba(255, 255, 255, 0.2)",
  },
};
