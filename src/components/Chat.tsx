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
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      
      {/* Left Panel for Brand Identity */}
      <div style={{ width: '40%', background: 'linear-gradient(to bottom, #2c3e50, #34495e)', color: '#f4f4f4', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <img src="/logo.png" alt="VesselIQ Logo" style={{ width: '200px', height: '80px', marginBottom: '20px' }} />
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>VesselIQ</h1>
        <p style={{ fontSize: '16px', textAlign: 'center', marginBottom: '20px' }}>Optimizing Maritime Performance</p>
        <p style={{ fontSize: '14px', textAlign: 'center', maxWidth: '80%' }}>Get actionable insights for vessel performance. Ask questions, monitor metrics, and enhance operations seamlessly.</p>
      </div>

      {/* Right Panel for Chat Interface */}
      <div style={{ width: '60%', display: 'flex', flexDirection: 'column', backgroundColor: '#132337' }}>
        
        {/* Chat Container */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                maxWidth: '80%',
                padding: '12px 18px',
                margin: '10px 0',
                borderRadius: '20px',
                backgroundColor: msg.sender === 'bot' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(74, 144, 226, 0.2)',
                color: '#f4f4f4',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', padding: '15px', backgroundColor: '#1c3b57', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '20px',
              border: 'none',
              outline: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#f4f4f4',
              marginRight: '10px',
            }}
            placeholder="Type your message..."
          />
          <button type="submit" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#4a90e2', color: '#f4f4f4', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
