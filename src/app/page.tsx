// page.tsx
import React from 'react';

export default function HomePage() {
  return (
    <div className="flex h-screen">
      {/* Left Side - Answers Section */}
      <div className="flex-1 p-4 border-r border-solid" style={{ borderColor: '#f4f4f4' }}>
        <h1 className="text-2xl font-bold mb-4">Answers</h1>
        <div id="answers-section" className="overflow-auto h-full">
          {/* Dynamically insert answers here */}
        </div>
      </div>

      {/* Right Side - Chatbot Section */}
      <div
        className="w-1/3 p-4 border-l border-solid shadow-lg"
        style={{
          borderColor: '#f4f4f4',
          backgroundColor: '#132337',
          boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)',
          borderRadius: '8px',
          transform: 'translateZ(0)',
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        <h2 className="text-xl font-bold mb-4">Chatbot</h2>
        <div id="chatbot-section" className="overflow-auto h-full">
          {/* Dynamically insert chatbot content here */}
        </div>
      </div>
    </div>
  );
}
