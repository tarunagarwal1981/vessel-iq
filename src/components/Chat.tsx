// src/components/Chat.tsx
"use client";
import React, { useState } from "react";

// Define the type for the props
type ChatProps = {
  setResponse: (response: string) => void;
};

export default function Chat({ setResponse }: ChatProps) {
  const [message, setMessage] = useState("");

  // Handle sending message to chatbot and updating response
  const handleSend = async () => {
    if (!message.trim()) return; // Ignore empty messages
    try {
      // Simulate a response - replace with actual API call if needed
      const chatbotResponse = `You said: ${message}`;
      setResponse(chatbotResponse); // Update parent component’s response
      setMessage(""); // Clear input field after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here"
        style={{
          padding: "0.5rem",
          fontSize: "1rem",
          borderRadius: "4px",
          border: "1px solid #f4f4f4",
          resize: "none",
          backgroundColor: "#132337",
          color: "#f4f4f4",
          outline: "none",
        }}
        rows={4}
      />
      <button
        onClick={handleSend}
        style={{
          padding: "0.5rem",
          backgroundColor: "#1f4068",
          color: "#f4f4f4",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Send
      </button>
    </div>
  );
}
