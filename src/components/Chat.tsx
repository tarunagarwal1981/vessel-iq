'use client';

import { useState, useEffect, useRef } from 'react';

type Message = {
  text?: string;
  image?: string;
  mapUrl?: string;
  sender: 'user' | 'bot';
  plots?: { [key: string]: string };
  isSynopsis?: boolean;
};

declare global {
  interface Window {
    L: any;
  }
}

const SynopsisMessage = ({ 
  text, 
  plots, 
  messageId 
}: { 
  text: string, 
  plots: { [key: string]: string }, 
  messageId: string 
}) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = {
    summary: text.split('\n\n')[0],
    hull: {
      title: "Hull Performance",
      content: text.match(/Hull Performance:([^]*?)(?=\n\n|$)/)?.[0] || "",
      plot: plots.hull_performance
    },
    speed: {
      title: "Speed Performance",
      content: text.match(/Speed Performance:([^]*?)(?=\n\n|$)/)?.[0] || "",
      plots: {
        laden: plots.speed_consumption_laden,
        ballast: plots.speed_consumption_ballast
      }
    },
    position: {
      title: "Vessel Position",
      content: text.match(/Current Position:([^]*?)(?=\n\n|$)/)?.[0] || "",
      plot: plots.position
    },
    recommendations: {
      title: "Recommendations",
      content: text.match(/Recommendations:([^]*?)$/)?.[0] || ""
    }
};

  return (
    <div style={{ width: '100%' }}>
      {/* Main Summary - Always Visible */}
      <div style={{ marginBottom: '10px' }}>{sections.summary}</div>
      
      {/* Collapsible Sections */}
      {Object.entries(sections).map(([key, section]) => {
        if (key === 'summary') return null;
        
        return (
          <div 
            key={key}
            style={{
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              marginBottom: '10px',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => toggleSection(key)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#f4f4f4',
                border: 'none',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <span>{section.title}</span>
              <span>{expandedSections[key] ? '▼' : '▶'}</span>
            </button>
            
            {expandedSections[key] && (
              <div style={{ padding: '10px' }}>
                <div>{section.content}</div>
                
                {key === 'hull' && section.plot && (
                  <img 
                    src={section.plot}
                    alt="Hull Performance"
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      borderRadius: '10px'
                    }}
                  />
                )}
                
                {key === 'speed' && section.plots && (
                  <>
                    <img 
                      src={section.plots.laden}
                      alt="Laden Speed Consumption"
                      style={{
                        width: '100%',
                        marginTop: '10px',
                        borderRadius: '10px'
                      }}
                    />
                    <img 
                      src={section.plots.ballast}
                      alt="Ballast Speed Consumption"
                      style={{
                        width: '100%',
                        marginTop: '10px',
                        borderRadius: '10px'
                      }}
                    />
                  </>
                )}
                
                {key === 'position' && section.plot && (
                  <div
                    id={`map-${messageId}-${key}`}
                    style={{ 
                      width: '100%', 
                      height: '300px',
                      marginTop: '10px',
                      borderRadius: '10px'
                    }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Welcome! How can I assist you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const mapInstances = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    return () => {
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
    if (mapInstances.current[containerId]) {
      mapInstances.current[containerId].remove();
      delete mapInstances.current[containerId];
    }

    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      document.head.appendChild(link);
    }

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

    if (!mapInstances.current[containerId]) {
      const map = window.L.map(containerId, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([lat, lon], 10);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      
      window.L.marker([lat, lon]).addTo(map);
      
      mapInstances.current[containerId] = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }
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

      const newMessages: Message[] = [];

      if (typeof data.response === 'string') {
        newMessages.push({
          text: data.response,
          sender: 'bot'
        });
      } else if (data.response) {
        if (data.response.message && data.response.plots) {
          // This is a synopsis message
          newMessages.push({
            text: data.response.message,
            plots: data.response.plots,
            isSynopsis: true,
            sender: 'bot'
          });
        } else if (data.response.message) {
          newMessages.push({
            text: data.response.message,
            sender: 'bot'
          });
        }

        if (data.response.plots && !data.response.isSynopsis) {
          Object.entries(data.response.plots).forEach(([plotType, url]) => {
            if (typeof url === 'string') {
              if (url.includes('openstreetmap.org')) {
                newMessages.push({
                  mapUrl: url,
                  sender: 'bot'
                });
              } else {
                if (plotType !== 'position') {
                  newMessages.push({
                    image: url,
                    sender: 'bot'
                  });
                }
              }
            }
          });
        }

        if (data.response.plot && !data.response.plots) {
          if (typeof data.response.plot === 'string') {
            newMessages.push({
              image: data.response.plot,
              sender: 'bot'
            });
          }
        }
      }

      console.log('New messages to add:', newMessages);
      setMessages(prev => [...prev, ...newMessages]);

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
      <div
        style={{
          width: '25%',
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

      <div style={{ width: '75%', display: 'flex', flexDirection: 'column', backgroundColor: '#132337' }}>
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {messages.map((msg, index) => {
            const messageId = `message-${index}`;
            
            return (
              <div
                key={messageId}
                style={{
                  alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                  maxWidth: msg.image || msg.mapUrl || msg.isSynopsis ? '100%' : '80%',
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
                {msg.isSynopsis && msg.plots ? (
                  <SynopsisMessage 
                    text={msg.text || ''} 
                    plots={msg.plots} 
                    messageId={messageId}
                  />
                ) : msg.mapUrl ? (
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
