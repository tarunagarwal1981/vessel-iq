'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components (client-side only)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

type Message = {
  text?: string;
  image?: string;
  mapUrl?: string;
  sender: 'user' | 'bot';
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Welcome! How can I assist you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(link);
    setIsMapLoaded(true);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const extractCoordinates = (mapUrl: string) => {
    try {
      const urlParams = new URL(mapUrl).searchParams;
      const lat = parseFloat(urlParams.get('mlat') || '0');
      const lon = parseFloat(urlParams.get('mlon') || '0');
      return { lat, lon };
    } catch (error) {
      console.error('Error parsing map URL:', error);
      return { lat: 0, lon: 0 };
    }
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.mapUrl && isMapLoaded) {
      const { lat, lon } = extractCoordinates(msg.mapUrl);
      return (
        <div style={{ width: '100%', height: '400px' }}>
          <MapContainer
            center={[lat, lon]}
            zoom={10}
            style={{ width: '100%', height: '100%', borderRadius: '10px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[lat, lon]} />
          </MapContainer>
        </div>
      );
    }
    
    if (msg.image) {
      return (
        <div style={{ width: '100%' }}>
          <img
            src={msg.image}
            alt="Chart"
            style={{ 
              width: '100%',
              maxHeight: '500px',
              objectFit: 'contain',
              borderRadius: '10px',
              marginBottom: '8px'
            }}
            onError={(e) => {
              console.error('Image failed to load:', e);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      );
    }
    
    if (msg.text) {
      return <div>{msg.text}</div>;
    }
    
    return null;
  };

  const fetchResponse = async (query: string) => {
    const lambdaUrl = process.env.NEXT_PUBLIC_LAMBDA_URL;
    try {
      console.log('Sending query:', query);

      const response = await fetch(lambdaUrl || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (data.response) {
        const newMessages: Message[] = [];

        // Handle main message
        if (data.response.message) {
          newMessages.push({
            text: data.response.message,
            sender: 'bot'
          });
        }

        // Handle map URL
        if (data.response.plots?.position) {
          newMessages.push({
            mapUrl: data.response.plots.position,
            sender: 'bot'
          });
        }

        // Handle other plots if present
        if (data.response.plots) {
          Object.entries(data.response.plots).forEach(([plotType, url]) => {
            if (plotType !== 'position' && typeof url === 'string') {
              newMessages.push({
                text: `${plotType.charAt(0).toUpperCase() + plotType.slice(1)} Condition`,
                sender: 'bot'
              });
              newMessages.push({
                image: url,
                sender: 'bot'
              });
            }
          });
        }

        console.log('New messages to add:', newMessages);
        setMessages(prev => [...prev, ...newMessages]);
      } else {
        setMessages(prev => [
          ...prev,
          { text: 'No answer provided by bot.', sender: 'bot' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prev => [
        ...prev,
        { text: 'Error fetching response. Please try again.', sender: 'bot' },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages(prev => [...prev, { text: input, sender: 'user' }]);
      fetchResponse(input);
      setInput('');
    }
  };

  return (
    <div style={{ display: 'flex', width: '120%', height: '100vh' }}>
      {/* Left Panel */}
      <div
        style={{
          width: '30%',
          background: 'linear-gradient(to bottom, #2c3e50, #34495e)',
          color: '#f4f4f4',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src="/logo.png"
          alt="VesselIQ Logo"
          style={{ width: '200px', height: '80px', marginBottom: '20px' }}
        />
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>VesselIQ</h1>
        <p style={{ fontSize: '16px', textAlign: 'center', marginBottom: '20px' }}>
          Optimizing Maritime Performance
        </p>
        <p style={{ fontSize: '14px', textAlign: 'center', maxWidth: '80%' }}>
          Get actionable insights for vessel performance. Ask questions, monitor metrics, and enhance
          operations seamlessly.
        </p>
      </div>

      {/* Right Panel */}
      <div style={{ width: '70%', display: 'flex', flexDirection: 'column', backgroundColor: '#132337' }}>
        {/* Chat Container */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                maxWidth: msg.image || msg.mapUrl ? '100%' : '80%',
                padding: '12px 18px',
                margin: '10px 0',
                borderRadius: '20px',
                backgroundColor: msg.sender === 'bot' 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(74, 144, 226, 0.2)',
                color: '#f4f4f4',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {renderMessageContent(msg)}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form 
          onSubmit={handleSubmit} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '15px', 
            backgroundColor: '#1c3b57', 
            borderTop: '1px solid rgba(255, 255, 255, 0.2)' 
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '20px',
              border: 'none',
              outline: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#f4f4f4',
              marginRight: '10px',
            }}
            placeholder="Type your message..."
          />
          <button 
            type="submit" 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: '#4a90e2', 
              color: '#f4f4f4', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
