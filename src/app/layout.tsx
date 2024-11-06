// src/app/layout.tsx

"use client"; // Marks this file as a client component, necessary for using hooks like useState.

import React from "react";
import "../globals.css"; // Ensure the path is correct for your CSS file.
import Chat from "../components/Chat"; // Correct path to Chat component

// Define the Layout component that includes the Chat component and any child components.
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="app-layout">
            {/* Chat component */}
            <Chat />
            {/* Render children passed to this layout */}
            <main>{children}</main>
        </div>
    );
}
