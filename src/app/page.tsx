"use client";

import { useState } from "react";

// Chat component types
interface LambdaResponse {
  response: string | null;
  metadata: {
    decision: string;
    vessel_name: string;
    explanation: string;
    response_type: string;
  };
}

// Chat component
function Chat({ setResponse }: { setResponse: (response: string) => void }) {
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
      
      if (data.response) {
        setResponse(data.response);
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
        className="w-full px-4 py-2 bg-[#2a4d7f] text-white rounded-lg 
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

// Main Home component
export default function Home() {
  const [response, setResponse] = useState<string>("");

  return (
    <div className="flex min-h-screen bg-[#132337]">
      {/* Response Area (70%) */}
      <div className="w-[70%] p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">VesselIQ Response</h2>
        <div className="bg-[#1a2a3d] p-6 rounded-lg text-white shadow-lg min-h-[calc(100vh-120px)]">
          {response ? (
            <div className="whitespace-pre-wrap">{response}</div>
          ) : (
            <div className="text-gray-400 italic">
              Welcome to VesselIQ! You can ask about:
              <ul className="list-disc list-inside mt-2">
                <li>Vessel performance scores</li>
                <li>Hull condition analysis</li>
                <li>Speed consumption profiles</li>
                <li>Crew performance metrics</li>
                <li>Engine troubleshooting</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Chat Area (30%) */}
      <div className="w-[30%] bg-[#1f4068] p-8 shadow-xl fixed right-0 h-screen overflow-y-auto">
        <h2 className="text-2xl font-semibold text-white mb-6">Ask VesselIQ</h2>
        <Chat setResponse={setResponse} />
      </div>
    </div>
  );
}
