// src/app/page.tsx
'use client';
import React, { useState } from 'react';
import Chat from '../components/Chat';

export default function HomePage() {
  const [response, setResponse] = useState('');

  // Define inline styles using CSSProperties for TypeScript compatibility
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#132337',
      color: '#f4f4f4',
      fontFamily: 'Nunito, sans-serif',
      fontSize: '12px',
    },
    answerSection: {
      width: '70%',
      padding: '20px',
      backgroundColor: '#132337',
      borderRight: '1px solid #f4f4f4', // Separating the answer and chat sections
    },
    chatSection: {
      width: '30%',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column' as const, // Ensure compatibility with CSSProperties
      justifyContent: 'space-between',
      backgroundColor: '#132337',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
    },
    chatHeader: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    responseText: {
      whiteSpace: 'pre-wrap', // Preserve formatting of response text
    },
  };

  return (
    <div style={styles.container}>
      {/* Left side for displaying answers */}
      <div style={styles.answerSection}>
        <h2 style={styles.chatHeader}>Answers</h2>
        <p style={styles.responseText}>{response}</p>
      </div>

      {/* Right side for chatbot input */}
      <div style={styles.chatSection}>
        <h2 style={styles.chatHeader}>Chatbot</h2>
        <Chat setResponse={setResponse} />
      </div>
    </div>
  );
}
