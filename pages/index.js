import { useState, useEffect } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Debug: Log Lambda URL on load
  useEffect(() => {
    console.log('Lambda URL:', process.env.NEXT_PUBLIC_LAMBDA_URL)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const lambdaUrl = process.env.NEXT_PUBLIC_LAMBDA_URL
    if (!lambdaUrl) {
      console.error('Lambda URL not configured')
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Error: Lambda URL not configured. Please check environment variables.' 
      }])
      return
    }

    setIsLoading(true)
    setMessages(prev => [...prev, { type: 'user', content: input }])
    
    try {
      console.log('Sending request to:', lambdaUrl)
      const response = await fetch(lambdaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const text = await response.text()
      console.log('Raw response:', text)
      
      let data
      try {
        data = JSON.parse(text)
      } catch (e) {
        console.error('JSON parse error:', e)
        throw new Error('Invalid response format')
      }
      
      console.log('Parsed data:', data)
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: data.response || 'No response received' 
      }])
    } catch (error) {
      console.error('Error details:', error)
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: `Error: ${error.message}. Please try again.` 
      }])
    } finally {
      setIsLoading(false)
      setInput('')
    }
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {/* Debug info */}
      <div className="mt-4 text-sm text-gray-500">
        Lambda URL configured: {process.env.NEXT_PUBLIC_LAMBDA_URL ? 'Yes' : 'No'}
      </div>
    </div>
  )
}
