'use client';
import Chat from '../components/Chat';

export default function ChatPage() {
  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
      <div style={{ width: '60%' }}>
        <Chat />
      </div>
    </main>
  );
}
