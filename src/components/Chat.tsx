'use client';

import { useState, useEffect, useRef } from 'react';

type Message = {
  text?: string;
  image?: string;
  mapUrl?: string;
  sender: 'user' | 'bot';
};

declare global {
  interface Window {
    L: any;
  }
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Welcome! How can I assist you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const mapInstances = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    return () => {
      // Cleanup all map instances when component unmounts
      Object.values(mapInstances.current).forEach(map => map.remove());
      mapInstances.current = {};
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

  const createMap = (containerId: string, lat: number, lon: number) => {
    // Clean up existing map instance if it exists
    if (mapInstances.current[containerId]) {
      mapInstances.current[containerId].remove();
      delete mapInstances.current[containerId];
    }

    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
      script.onload = () => {
        initializeMap(containerId, lat, lon);
      };
      document.head.appendChild(script);
    } else {
      initializeMap(containerId, lat, lon);
    }
  };

  const initializeMap = (containerId: string, lat: number, lon: number) => {
    if (!window.L) return;

    const mapContainer = document.getElementById(containerId);
    if (!mapContainer) return;

    // Only create new map if one doesn't exist for this container
    if (!mapInstances.current[containerId]) {
      const map = window.L.map(containerId).setView([lat, lon], 10);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      
      window.L.marker([lat, lon]).addTo(map);
      
      // Store the map instance
      mapInstances.current[containerId] = map;
    }
  };

  // Update this function in your chat.tsx:

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

        // Handle main message first
        if (data.response.message) {
          newMessages.push({
            text: data.response.message,
            sender: 'bot'
          });
        }

        // Handle plots/charts/maps
        if (data.response.plots) {
          Object.entries(data.response.plots).forEach(([plotType, url]) => {
            if (typeof url === 'string') {
              if (url.includes('openstreetmap.org')) {
                // Handle map URL
                newMessages.push({
                  mapUrl: url,
                  sender: 'bot'
                });
              } else if (url.startsWith('http') || url.startsWith('https')) {
                // Handle image plots (e.g., charts)
                if (plotType !== 'position') {  // Skip if it's a position plot
                  newMessages.push({
                    text: `${plotType.charAt(0).toUpperCase() + plotType.slice(1)} Condition`,
                    sender: 'bot'
                  });
                  newMessages.push({
                    image: url,
                    sender: 'bot'
                  });
                }
              }
            }
          });
        }

        // Handle single plot/chart if present
        if (data.response.plot && !data.response.plots) {
          if (typeof data.response.plot === 'string') {
            if (data.response.plot.includes('openstreetmap.org')) {
              newMessages.push({
                mapUrl: data.response.plot,
                sender: 'bot'
              });
            } else {
              newMessages.push({
                image: data.response.plot,
                sender: 'bot'
              });
            }
          }
        }

        // Handle metadata if present
        if (data.response.metadata?.xAxisLabel && data.response.metadata?.yAxisLabel) {
          newMessages.push({
            text: `${data.response.metadata.xAxisLabel} vs ${data.response.metadata.yAxisLabel}`,
            sender: 'bot'
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

// Update the message rendering part in your JSX:

{messages.map((msg, index) => {
  const messageId = `message-${index}`;
  
  return (
    <div
      key={messageId}
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
      {msg.text && (
        <div style={{ marginBottom: msg.image || msg.mapUrl ? '10px' : '0' }}>
          {msg.text}
        </div>
      )}
      {msg.image && (
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
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = 'Error loading image';
            }}
          />
        </div>
      )}
      {msg.mapUrl && (
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
          <div
            id={`map-${messageId}`}
            style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              position: 'relative',
              zIndex: 1
            }}
            ref={(el) => {
              if (el && msg.mapUrl) {
                const { lat, lon } = extractCoordinates(msg.mapUrl);
                createMap(`map-${messageId}`, lat, lon);
              }
            }}
          />
        </div>
      )}
    </div>
  );
})}

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
          {messages.map((msg, index) => {
            const messageId = `message-${index}`;
            
            return (
              <div
                key={messageId}
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
                {msg.mapUrl ? (
                  <div
                    id={`map-${messageId}`}
                    style={{ width: '100%', height: '400px', borderRadius: '10px' }}
                    ref={(el) => {
                      if (el && msg.mapUrl) {
                        const { lat, lon } = extractCoordinates(msg.mapUrl);
                        requestAnimationFrame(() => {
                          createMap(`map-${messageId}`, lat, lon);
                        });
                      }
                    }}
                  />
                ) : msg.image ? (
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
                ) : (
                  <div>{msg.text}</div>
                )}
              </div>
            );
          })}
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
