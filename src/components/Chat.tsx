'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';

type Message = {
  type: 'user' | 'assistant';
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage = input;
    setInput('');
    setIsLoading(true);

    try {
      // Add to messages immediately for UI responsiveness
      setMessages(prev => [...prev, { 
        type: 'user',
        content: newMessage
      }]);

      // Simulate API call - replace with your actual API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage })
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
    <div className="h-screen flex">
      {/* Left side - Messages/Answers */}
      <div className="flex-1 bg-[#132337] p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`p-4 rounded-lg ${
              msg.type === 'user' 
                ? 'bg-blue-600 ml-auto max-w-[80%]' 
                : 'bg-gray-800 max-w-[80%]'
            }`}>
              <p className="text-white text-sm">{msg.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat input fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a2a3d] border-t border-gray-700">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 flex items-center gap-2">
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
            className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
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
    </div>
  );
}
