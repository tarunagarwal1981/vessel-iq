"use client";

// src/components/Chat.tsx

import React, { useState } from "react";
import "./Chat.css"; // Ensure the path to Chat.css is correct

interface ChatProps {
  setResponse: React.Dispatch<React.SetStateAction<string>>;
}

const Chat: React.FC<ChatProps> = ({ setResponse }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    // Placeholder response logic
    setResponse(`Response to: ${message}`);
    setMessage("");
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about vessel performance, hull condition, or engine..."
          className="chat-input"
        />
        <button onClick={handleSend} className="chat-send-button">Send</button>
      </div>
    </div>
  );
};

export default Chat;
