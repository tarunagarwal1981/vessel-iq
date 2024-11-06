// src/app/layout.tsx
"use client";  // Required for using hooks or other client-side components

import React, { useState } from "react";
import Chat from "../components/Chat";
import "../globals.css";

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen((prev) => !prev);
    };

    return (
        <div className="app-layout">
            {/* Chat Button */}
            <button onClick={toggleChat} className="chat-toggle-button">
                {isChatOpen ? "Close Chat" : "Open Chat"}
            </button>
            
            {/* Conditionally render Chat component */}
            {isChatOpen && <Chat closeChat={toggleChat} />}

            {/* Render children passed to this layout */}
            <main>{children}</main>
        </div>
    );
}
