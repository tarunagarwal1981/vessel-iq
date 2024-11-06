// src/app/layout.tsx

"use client"; // Marks this file as a client component.

import React, { useState } from "react";
import "./globals.css"; // Ensure the path is correct.
import Chat from "../components/Chat"; // Correct path to Chat component

export default function Layout({ children }: { children: React.ReactNode }) {
    // Define a closeChat function to satisfy ChatProps requirements.
    const closeChat = () => {
        console.log("Chat closed");
    };

    return (
        <div className="app-layout">
            {/* Pass closeChat prop to Chat component */}
            <Chat closeChat={closeChat} />
            <main>{children}</main>
        </div>
    );
}
