"use client";

import { useState } from "react";

interface ChatProps {
  setResponse: (response: string) => void;
}

export default function Chat({ setResponse }: ChatProps) {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;
    
    try {
      const chatbotResponse = `You said: ${message}`;
      setResponse(chatbotResponse);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here"
        className="p-2 text-base rounded bg-[#132337] text-[#f4f4f4] 
                   border border-[#f4f4f4] resize-none focus:outline-none"
        rows={4}
      />
      <button
        onClick={handleSend}
        className="p-2 bg-[#1f4068] text-[#f4f4f4] rounded 
                   border border-[#f4f4f4] cursor-pointer 
                   hover:bg-[#2a4d7f] transition-colors"
      >
        Send
      </button>
    </div>
  );
}
