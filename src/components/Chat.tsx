// components/Chat.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { SendHorizontal, Bot, User, Loader2 } from 'lucide-react'

type Message = {
  role: 'assistant' | 'user'
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_LAMBDA_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch response')
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: 'I apologize, but I encountered an error processing your request. Please try again.' 
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">
      <div className="bg-[#1a324d] rounded-t-xl p-4 border-b border-[#2a4a6d]">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Bot className="w-6 h-6" />
          VesselIQ Chat
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.role === 'assistant' ? 'bg-[#1a324d]' : 'bg-[#2a4a6d]'
            } p-4 rounded-lg max-w-[85%] ${
              message.role === 'assistant' ? 'mr-auto' : 'ml-auto'
            }`}
          >
            {message.role === 'assistant' ? (
              <Bot className="w-6 h-6 mt-1 flex-shrink-0" />
            ) : (
              <User className="w-6 h-6 mt-1 flex-shrink-0" />
            )}
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 bg-[#1a324d] p-4 rounded-lg max-w-[85%]">
            <Bot className="w-6 h-6 mt-1" />
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSubmit}
        className="border-t border-[#2a4a6d] bg-[#1a324d] p-4 rounded-b-xl"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[#132337] border border-[#2a4a6d] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3a5a7d] placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#2a4a6d] hover:bg-[#3a5a7d] disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <SendHorizontal className="w-5 h-5" />
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
