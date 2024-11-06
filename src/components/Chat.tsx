'use client';

import { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([{ text: 'Welcome! How can I assist you today?', sender: 'bot' }]);
  const [input, setInput] = useState('');

  const fetchResponse = async (query: string) => {
    const lambdaUrl = process.env.NEXT_PUBLIC_LAMBDA_URL;
    console.log("Lambda URL:", lambdaUrl); // Debugging the URL
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
      console.log("API Response Data:", data); // Debugging the response data

      // Access the specific field `data.response` based on your structure
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
    <div style={{ width: '100%', height: '100vh', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#132337' }}>
      <div style={{ width: '60%', backgroundColor: '#1c3b57', padding: '20px', borderRadius: '8px' }}>
        <div style={{ height: '70vh', overflowY: 'auto', padding: '10px', borderRadius: '4px', backgroundColor: '#132337' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.sender === 'bot' ? 'left' : 'right',
                padding: '8px 12px',
                margin: '6px 0',
                borderRadius: '12px',
                backgroundColor: msg.sender === 'bot' ? '#1e4c77' : '#22586e',
                color: '#f4f4f4',
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '4px 0 0 4px',
              border: '1px solid #4a90e2',
              outline: 'none',
              backgroundColor: '#132337',
              color: '#f4f4f4',
            }}
            placeholder="Type your message..."
          />
          <button type="submit" style={{ padding: '10px', borderRadius: '0 4px 4px 0', backgroundColor: '#4a90e2', color: '#f4f4f4', border: 'none', cursor: 'pointer' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
