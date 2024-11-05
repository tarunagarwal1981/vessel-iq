"use client";

// src/components/Chat.tsx
import React, { useState } from "react";
import "./Chat.css"; // This will include the styles for the chatbot design

const Chat = ({ setResponse }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot", time: "12:00" },
  ]);
  const [input, setInput] = useState("");

  const toggleChatbox = () => setIsVisible(!isVisible);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { text: input, sender: "user", time: new Date().toLocaleTimeString() };
      setMessages([...messages, newMessage]);
      setInput("");
      setResponse(input); // This passes the input to any response handler in parent components
      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "This is an automated response.", sender: "bot", time: new Date().toLocaleTimeString() },
        ]);
      }, 1000);
    }
  };

  return (
    <div>
      <div className={`chat-button ${isVisible ? "hidden" : ""}`} onClick={toggleChatbox}>
        <span>Message Us</span>
      </div>
      <div className={`chat-box ${isVisible ? "visible" : ""}`}>
        <div className="chat-box-header">
          <h3>Message Us</h3>
          <p onClick={toggleChatbox}><i className="fa fa-times" /></p>
        </div>
        <div className="chat-box-body">
          {messages.map((message, index) => (
            <div key={index} className={`chat-box-body-${message.sender}`}>
              <p>{message.text}</p>
              <span>{message.time}</span>
            </div>
          ))}
        </div>
        <div className="chat-box-footer">
          <input
            type="text"
            placeholder="Enter Your Message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <i className="send far fa-paper-plane" onClick={handleSend}></i>
        </div>
      </div>
    </div>
  );
};

export default Chat;
