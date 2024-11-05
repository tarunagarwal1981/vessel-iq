"use client";

import { useState } from "react";
import Chat from "../components/Chat";

export default function Home() {
  const [response, setResponse] = useState("");

  return (
    <div className="flex min-h-screen">
      <div className="w-[70%] p-8 border-r border-[#f4f4f4] overflow-y-auto">
        <h2 className="text-2xl mb-4">Chatbot Response</h2>
        <div className="whitespace-pre-wrap">{response}</div>
      </div>
      
      <div className="w-[30%] p-8 bg-[#1f4068]">
        <h2 className="text-2xl mb-4">Chatbot</h2>
        <Chat setResponse={setResponse} />
      </div>
    </div>
  );
}
