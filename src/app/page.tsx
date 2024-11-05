import React from 'react';

export default function HomePage() {
  return (
    <div className="flex h-screen bg-[#132337] text-[#f4f4f4] font-nunito">
      {/* Left Side - Answers Section */}
      <div
        className="flex-1 p-6 border-r border-[#f4f4f4] overflow-auto"
        style={{ fontSize: '12px' }}
      >
        <h1 className="text-2xl font-bold mb-4">Answers</h1>
        <div id="answers-section">
          {/* Dynamically insert answers here */}
        </div>
      </div>

      {/* Right Side - Chatbot Section */}
      <div
        className="w-1/3 p-6 border-l border-[#f4f4f4] shadow-2xl bg-[#132337] rounded-lg transform"
        style={{
          boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)',
          transform: 'translateZ(10px) scale(1.02)',
          perspective: '1000px',
          fontSize: '12px',
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
