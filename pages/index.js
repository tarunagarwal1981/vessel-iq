import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    setMessages(prev => [...prev, { type: 'user', content: input }])
    
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_LAMBDA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      })
      
      const data = await response.json()
      setMessages(prev => [...prev, { type: 'bot', content: data.response }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { type: 'bot', content: 'Sorry, something went wrong.' }])
    }
    
    setIsLoading(false)
    setInput('')
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">VesselIQ Chat</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg min-h-[400px] mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${
              message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-center">Loading...</div>}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  )
}
