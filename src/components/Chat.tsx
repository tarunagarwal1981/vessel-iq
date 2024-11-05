"use client";
// src/components/Chat.tsx

import React, { useState } from "react";
import "./Chat.css";

interface ChatProps {
  closeChat: () => void;
}

const Chat: React.FC<ChatProps> = ({ closeChat }) => {
  const [messages, setMessages] = useState<{ text: string; type: "send" | "receive" }[]>([]);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, type: "send" }]);
      setMessage("");
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-box-header">
        <h3>Message Us</h3>
        <p onClick={closeChat}><i className="fa fa-times"></i></p>
      </div>
      <div className="chat-box-body">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-box-body-${msg.type}`}>
            <p>{msg.text}</p>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="chat-box-footer">
        <button id="addExtra"><i className="fa fa-plus"></i></button>
        <input
          placeholder="Enter Your Message"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <i className="send far fa-paper-plane" onClick={handleSend}></i>
      </div>
    </div>
  );
};

export default Chat;
