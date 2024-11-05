"use client";

import { useState } from "react";
import Chat from "../components/Chat";

export default function Home() {
  const [response, setResponse] = useState<string>("");

  return (
    <div className="flex min-h-screen bg-[#132337]">
      <div className="w-8/12 p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">VesselIQ Response</h2>
        <div className="bg-[#1a2a3d] p-6 rounded-lg text-white shadow-lg min-h-[200px]">
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
      
      <div className="w-4/12 bg-[#1f4068] p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-6">Ask VesselIQ</h2>
        <Chat setResponse={setResponse} />
      </div>
    </div>
  );
}
