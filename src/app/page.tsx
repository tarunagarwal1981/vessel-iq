import React from 'react';

export default function HomePage() {
  return (
    <div className="container">
      {/* Left Side - Answers Section */}
      <div className="answers-section">
        <h1>Answers</h1>
        <div id="answers-section">
          {/* Content for answers will go here */}
        </div>
      </div>

      {/* Right Side - Chatbot Section */}
      <div className="chatbot-section">
        <h2>Chatbot</h2>
        <div id="chatbot-section">
          {/* Chatbot interface goes here */}
        </div>
      </div>
    </div>
  );
}
