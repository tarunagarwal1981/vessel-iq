'use client';
import { useState } from 'react';
import Chat from '../components/Chat';

export default function ChatPage() {
  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Chat />
    </main>
  );
}
