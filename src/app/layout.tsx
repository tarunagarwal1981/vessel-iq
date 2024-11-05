import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#132337',
      color: '#f4f4f4',
      fontFamily: 'Nunito, sans-serif',
    }}>
      <div style={{
        flex: 1,
        padding: '20px',
        borderRight: '1px solid #f4f4f4',
      }}>
        <h1>Answers</h1>
        <div id="answer-section">
          {/* Answer content will be injected here */}
          {children}
        </div>
      </div>
      <div style={{
        width: '30%',
        padding: '20px',
        backgroundColor: '#1a2a3d',
        color: '#f4f4f4',
        boxShadow: 'inset -4px 0 6px rgba(0,0,0,0.2)',
      }}>
        <h1>Chatbot</h1>
        <div id="chatbot-section">
          {/* Chatbot input and messages */}
        </div>
      </div>
    </div>
  );
}
