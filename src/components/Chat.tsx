"use client";

import { useState } from "react";

interface ChatProps {
  setResponse: (response: string) => void;
}

interface LambdaResponse {
  response: string | null;
  metadata: {
    decision: string;
    vessel_name: string;
    explanation: string;
    response_type: string;
  };
}

export default function Chat({ setResponse }: ChatProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_LAMBDA_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get response');
      }

      const data: LambdaResponse = await response.json();
      
      // Handle the structured response from Lambda
      if (data.response) {
        setResponse(data.response);
        console.log('Metadata:', data.metadata); // For debugging
      } else {
        throw new Error('No response data received');
      }

      setMessage("");
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || "Failed to get response. Please try again.");
      setResponse("Error: Failed to get response from server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Ask about vessel performance, hull condition, or engine troubleshooting..."
        className="w-full p-3 rounded-lg bg-[#132337] text-white border border-[#2a4d7f] 
                   resize-none focus:outline-none focus:border-[#3a5d8f] min-h-[120px]
                   placeholder-gray-400 disabled:opacity-50"
        disabled={isLoading}
      />
      {error && (
        <div className="text-red-400 text-sm px-2">{error}</div>
      )}
      <button
        onClick={handleSend}
        disabled={isLoading || !message.trim()}
        className="px-4 py-2 bg-[#2a4d7f] text-white rounded-lg 
                   hover:bg-[#3a5d8f] transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          'Send'
        )}
      </button>
    </div>
  );
}
