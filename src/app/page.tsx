import { useState } from 'react';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    if (!message) return;

    // Make a request to your API endpoint here
    const apiResponse = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: message }),
    });

    const data = await apiResponse.json();
    setResponse(data.answer);
    setMessage(''); // Clear the input field
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      {/* Left side for answers */}
      <div style={{ flex: 1, padding: '20px', borderRight: '1px solid #f4f4f4' }}>
        <h2>Answers</h2>
        <div style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
          {response}
        </div>
      </div>

      {/* Right side for chatbot input */}
      <div style={{
        width: '30%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '20px',
        backgroundColor: '#1a2a3d',
        boxShadow: 'inset -4px 0 6px rgba(0, 0, 0, 0.2)',
      }}>
        <h2>Chatbot</h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 'auto',
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: '#2a3b4d',
          boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)',
        }}>
          <input
            type="text"
            placeholder="Type your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              padding: '8px',
              backgroundColor: 'transparent',
              color: '#f4f4f4',
              outline: 'none',
            }}
          />
          <button onClick={handleSend} style={{
            backgroundColor: '#132337',
            color: '#f4f4f4',
            padding: '8px 12px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '1px 1px 4px rgba(255, 255, 255, 0.2)',
          }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
