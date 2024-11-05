// Chat.tsx or page.tsx (depending on where you implemented the chat layout)

import React, { useState } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prevMessages) => [...prevMessages, { text: input, sender: "User" }]);
      setInput("");
      // Placeholder for bot response simulation (API call here)
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, { text: "Bot's response to: " + input, sender: "Bot" }]);
      }, 500);
    }
  };

  return (
    <div className="container">
      <div className="answerArea">
        <h2>Answers</h2>
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender === "User" ? "userMessage" : "botMessage"}>
              {msg.text}
            </div>
          ))}
        </div>
      </div>
      <div className="chatbotArea">
        <h2>Chatbot</h2>
        <div className="inputContainer">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here"
            className="chatInput"
          />
          <button onClick={handleSendMessage} className="sendButton">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
