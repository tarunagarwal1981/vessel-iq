'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';

type Message = {
  type: 'user' | 'assistant';
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setMessages(prev => [...prev, { 
        type: 'user',
        content: input
      }]);
      setInput('');
      setIsLoading(true);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: data.response
      }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 flex flex-col bg-[#132337]">
      {/* Messages Container */}
      <div className="flex-1 w-full overflow-y-auto p-4">
        {messages.map((msg, idx) => (
          <div 
            key={idx}
            className={`max-w-[80%] mb-4 p-4 rounded-lg ${
              msg.type === 'user' 
                ? 'ml-auto bg-blue-600 text-white' 
                : 'mr-auto bg-gray-800 text-white'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="w-full border-t border-gray-700 bg-[#1a2a3d]">
        <form 
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-4"
        >
          <button 
            type="button"
            className="p-2 text-gray-400 hover:text-gray-300"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here"
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none border-none"
          />

          <button 
            type="submit"
            disabled={isLoading}
            className="p-2 text-blue-400 hover:text-blue-300 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </main>
  );
}
