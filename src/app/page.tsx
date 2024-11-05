"use client";

import { useState } from "react";
import Chat from "../components/Chat";

export default function Home() {
  const [response, setResponse] = useState<string>("");

  return (
    <div className="flex min-h-screen bg-[#132337]">
      <div className="w-8/12 p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Chatbot Response</h2>
        <div className="bg-[#1a2a3d] p-6 rounded-lg text-white min-h-[200px] whitespace-pre-wrap">
          {response || "No response yet..."}
        </div>
      </div>
      
      <div className="w-4/12 bg-[#1f4068] p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Chatbot</h2>
        <Chat setResponse={setResponse} />
      </div>
    </div>
  );
}
