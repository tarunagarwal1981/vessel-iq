import React, { useState } from "react";
import styles from "./Chat.module.css"; // Create this CSS file for styling

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
    <div className={styles.container}>
      <div className={styles.answerArea}>
        <h2>Answers</h2>
        <div className={styles.messages}>
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender === "User" ? styles.userMessage : styles.botMessage}>
              {msg.text}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.chatbotArea}>
        <h2>Chatbot</h2>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here"
            className={styles.chatInput}
          />
          <button onClick={handleSendMessage} className={styles.sendButton}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
