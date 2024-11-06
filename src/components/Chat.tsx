'use client';

import { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([{ text: 'Welcome! How can I assist you today?', sender: 'bot' }]);
  const [input, setInput] = useState('');

  const fetchResponse = async (query: string) => {
    const lambdaUrl = process.env.NEXT_PUBLIC_LAMBDA_URL;
    try {
      const response = await fetch(lambdaUrl || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.response) {
        setMessages((prev) => [...prev, { text: data.response, sender: 'bot' }]);
      } else {
        setMessages((prev) => [...prev, { text: 'No answer provided by bot.', sender: 'bot' }]);
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((prev) => [...prev, { text: 'Error fetching response. Please try again.', sender: 'bot' }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prev) => [...prev, { text: input, sender: 'user' }]);
      fetchResponse(input);
      setInput('');
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#132337' }}>
      <div style={{ width: '60%', maxWidth: '800px', backgroundColor: '#1c3b57', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: '#1e4c77', padding: '20px', textAlign: 'center', color: '#f4f4f4', fontSize: '24px', fontWeight: 'bold' }}>
          VesselIQ - Your Maritime Performance Assistant
        </div>

        {/* Chat Messages */}
        <div style={{ height: '60vh', padding: '20px', overflowY: 'auto', backgroundColor: '#132337' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.sender === 'bot' ? 'left' : 'right',
                padding: '10px 15px',
                margin: '10px 0',
                borderRadius: '16px',
                backgroundColor: msg.sender === 'bot' ? '#1e4c77' : '#4a90e2',
                color: '#f4f4f4',
                maxWidth: '80%',
                alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', borderTop: '1px solid #4a90e2', backgroundColor: '#1c3b57' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: '15px',
              border: 'none',
              outline: 'none',
              backgroundColor: '#132337',
              color: '#f4f4f4',
              borderRadius: '0 0 0 12px',
            }}
            placeholder="Type your message..."
          />
          <button type="submit" style={{ padding: '15px 20px', backgroundColor: '#4a90e2', color: '#f4f4f4', border: 'none', borderRadius: '0 0 12px 0', cursor: 'pointer' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
