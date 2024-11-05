import { useState } from "react";

interface ChatProps {
  setResponse: (response: string) => void;
}

export default function Chat({ setResponse }: ChatProps) {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;
    
    try {
      // Simulate chatbot response - replace with actual API call
      const chatbotResponse = `You said: ${message}`;
      setResponse(chatbotResponse);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      setResponse("Sorry, there was an error processing your message.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your message here..."
        className="p-2 text-base rounded bg-[#132337] text-[#f4f4f4] 
                   border border-[#f4f4f4] resize-none focus:outline-none 
                   focus:ring-2 focus:ring-[#1f4068] min-h-[100px]"
      />
      <button
        onClick={handleSend}
        disabled={!message.trim()}
        className="p-2 bg-[#1f4068] text-[#f4f4f4] rounded 
                   border border-[#f4f4f4] cursor-pointer 
                   hover:bg-[#2a4d7f] transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  );
}
