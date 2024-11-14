'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Types
type VesselScore = {
  vessel_score: number;
  cost_score: number;
  digitalization_score: number;
  environment_score: number;
  operation_score: number;
  reliability_score: number;
};

type ResponseMetadata = {
  decision: string;
  vessel_name: string;
  explanation: string;
  response_type: string;
  status: string;
  processing_time?: number;
  cache_hit?: boolean;
};

type Message = {
  text?: string;
  image?: string;
  mapUrl?: string;
  charts?: {
    hull?: string;
    speed?: {
      laden?: string;
      ballast?: string;
    };
  };
  scores?: VesselScore;
  metadata?: ResponseMetadata;
  sender: 'user' | 'bot';
  timestamp: number;
};

// Dynamic imports
const MapComponent = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="map-loading">
      Loading map...
      <style jsx>{`
        .map-loading {
          width: 100%;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }
      `}</style>
    </div>
  ),
});

// Sub-components
const ScoreCard: React.FC<{ score: number; label: string }> = ({ score, label }) => (
  <div className="score-card">
    <div className="label">{label}</div>
    <div className={`score ${score >= 75 ? 'good' : score >= 60 ? 'average' : 'poor'}`}>
      {score.toFixed(1)}%
    </div>
    <style jsx>{`
      .score-card {
        background: rgba(255, 255, 255, 0.1);
        padding: 10px;
        border-radius: 8px;
        margin: 5px 0;
      }
      .label {
        font-size: 12px;
        color: #ffffff80;
      }
      .score {
        font-size: 16px;
        font-weight: bold;
      }
      .good { color: #4caf50; }
      .average { color: #ffc107; }
      .poor { color: #f44336; }
    `}</style>
  </div>
);

const Chart: React.FC<{ url: string; title: string }> = ({ url, title }) => (
  <div className="chart-container">
    <h4>{title}</h4>
    <img 
      src={url} 
      alt={title}
      className="chart-image"
      loading="lazy"
    />
    <style jsx>{`
      .chart-container {
        margin: 10px 0;
        background: rgba(0, 0, 0, 0.2);
        padding: 10px;
        border-radius: 8px;
      }
      .chart-image {
        width: 100%;
        max-height: 400px;
        object-fit: contain;
        border-radius: 4px;
      }
    `}</style>
  </div>
);

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`message ${message.sender}`}
    >
      {message.text && <div className="text">{message.text}</div>}

      {message.scores && (
        <div className="scores-grid">
          <ScoreCard score={message.scores.vessel_score} label="Overall Score" />
          <ScoreCard score={message.scores.cost_score} label="Cost" />
          <ScoreCard score={message.scores.environment_score} label="Environment" />
          <ScoreCard score={message.scores.operation_score} label="Operation" />
          <ScoreCard score={message.scores.reliability_score} label="Reliability" />
          <ScoreCard score={message.scores.digitalization_score} label="Digitalization" />
        </div>
      )}

      {message.charts?.hull && (
        <Chart url={message.charts.hull} title="Hull Performance" />
      )}

      {message.charts?.speed?.laden && (
        <Chart url={message.charts.speed.laden} title="Speed Performance (Laden)" />
      )}

      {message.charts?.speed?.ballast && (
        <Chart url={message.charts.speed.ballast} title="Speed Performance (Ballast)" />
      )}

      {message.mapUrl && <MapComponent mapUrl={message.mapUrl} />}

      {message.metadata?.processing_time && (
        <div className="metadata">
          Processed in {(message.metadata.processing_time / 1000).toFixed(2)}s
          {message.metadata.cache_hit && ' (cached)'}
        </div>
      )}

      <style jsx>{`
        .message {
          max-width: 80%;
          margin: 10px;
          padding: 15px;
          border-radius: 15px;
          background: ${message.sender === 'bot' ? 'rgba(255, 255, 255, 0.1)' : '#1a73e8'};
          align-self: ${message.sender === 'bot' ? 'flex-start' : 'flex-end'};
          position: relative;
        }
        .text {
          color: #ffffff;
          margin-bottom: 10px;
          white-space: pre-wrap;
          line-height: 1.5;
        }
        .scores-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          margin: 10px 0;
        }
        .metadata {
          font-size: 12px;
          color: #ffffff80;
          margin-top: 5px;
          text-align: right;
        }
      `}</style>
    </motion.div>
  );
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: 'Welcome to VesselIQ! Ask me about vessel performance, technical analysis, or request a complete vessel synopsis.',
      sender: 'bot',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const processResponse = useCallback((data: any): Message[] => {
    const newMessages: Message[] = [];
    const now = Date.now();
    
    if (data.response) {
      newMessages.push({
        text: typeof data.response === 'string' ? data.response : data.response.message,
        sender: 'bot',
        timestamp: now,
        metadata: data.metadata
      });
    }

    if (data.data?.vessel_score?.metadata?.scores) {
      newMessages.push({
        scores: data.data.vessel_score.metadata.scores,
        sender: 'bot',
        timestamp: now + 1
      });
    }

    if (data.data?.hull_performance?.response?.plot || 
        data.data?.speed_consumption?.response?.plots) {
      newMessages.push({
        charts: {
          hull: data.data?.hull_performance?.response?.plot,
          speed: data.data?.speed_consumption?.response?.plots
        },
        sender: 'bot',
        timestamp: now + 2
      });
    }

    if (data.data?.position?.response?.plots?.plot) {
      newMessages.push({
        mapUrl: data.data.position.response.plots.plot,
        sender: 'bot',
        timestamp: now + 3
      });
    }

    return newMessages;
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      text: input.trim(),
      sender: 'user' as const,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_LAMBDA_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage.text }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      const newMessages = processResponse(data);
      
      setMessages(prev => [...prev, ...newMessages]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };

  return (
    <div className="chat-container" ref={chatContainerRef}>
      <div className="messages-container">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <MessageBubble key={message.timestamp} message={message} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isLoading}
          className="message-input"
        />
        <button type="submit" disabled={isLoading} className="send-button">
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100vh;
          background-color: #132337;
          color: white;
          overflow: hidden;
        }
        .messages-container {
          flex-grow: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          scroll-behavior: smooth;
        }
        .input-container {
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          gap: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .message-input {
          flex-grow: 1;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 16px;
          transition: border-color 0.2s;
        }
        .message-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.3);
        }
        .message-input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .send-button {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          background: #1a73e8;
          color: white;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .send-button:hover:not(:disabled) {
          background: #1557b0;
        }
        .send-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .messages-container {
            padding: 10px;
          }
          .input-container {
            padding: 10px;
          }
          .message-input {
            font-size: 14px;
          }
          .send-button {
            padding: 10px 20px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Chat;
