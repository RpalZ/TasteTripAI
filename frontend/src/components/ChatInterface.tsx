'use client'

import { useState, useEffect, useRef } from 'react'

// Add CSS keyframes for animations
const animationStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`
import ChatInput from '@/components/ChatInput'
import MessageBubble from '@/components/MessageBubble'
import RecommendationCard from '@/components/RecommendationCard'
import TasteHistory from '@/components/TasteHistory'
import { Menu, X, Sparkles, ArrowLeft } from 'lucide-react'
import { useTheme } from './ThemeContext'
import { supabase } from '@/utils/supabaseClient'
import { SYSTEM_PROMPT } from '@/constants/systemPrompt'
import axios from 'axios'

// const systemPrompt = SYSTEM_PROMPT

interface Message {
  id: string
  type: 'user' | 'ai' | 'system'
  content: string
  timestamp: Date

} 

interface Recommendation {
  title: string
  type: string
  description: string
  location?: string
  lat?: number
  lng?: number
}

interface gptResponse {
  message: string,
  action: {
    toolcall: "recommend" | "idle" | "analyze",
    recommendQuery?: string,
    toAnalyze?: string
  }
}

interface ChatInterfaceProps {
  initialQuery?: string
  onBack?: () => void
  conversationId?: string | null
  onConversationCreated?: (conversationId: string) => void
}

export default function ChatInterface({ initialQuery, onBack, conversationId, onConversationCreated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRecommending, setIsRecommending] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])



  useEffect(() => {

    //fetching messages from supabase
    const fetchMessages = async () => {
      if (!conversationId) {
        setMessages([
         
          {
            id: '1',
            type: 'ai',
            content: "Hello! I'm your cultural discovery assistant. Tell me about your tastes - what kind of food, music, places, or experiences do you enjoy? I'll help you discover amazing cultural recommendations tailored just for you! ✨",
            timestamp: new Date(),
          }
        ])
        return
      }
      setIsLoading(true)
      const { data, error } = await supabase
        .from('chats')
        .select('id, message, sender_type, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      if (data) {
        setMessages(
          data.map((msg: any) => ({
            id: msg.id,
            type: msg.sender_type,
            content: msg.message,
            timestamp: new Date(msg.created_at),
          }))
        )
      }
      setIsLoading(false)
    }
    fetchMessages()
  }, [conversationId])

  // Debug: log when messages change
  useEffect(() => {
    console.log('Messages updated:', messages)
  }, [messages])

  // Debug: log when isRecommending changes
  useEffect(() => {
    console.log('isRecommending changed:', isRecommending)
  }, [isRecommending])

  //scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  //handle user input
  const handleUserInput = async (input: string) => {
    console.log('handleUserInput called with:', input)
    setIsLoading(true)
    let convId = conversationId
    let userId: string | null = null
    // Get user ID from Supabase session
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData.session) {
      userId = sessionData.session.user.id
    }
    if (!userId) {
      setIsLoading(false)
      return
    }
    // If no conversation, create one
    if (!convId) {
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert([{ user_id: userId }])
        .select('id')
        .single()
      if (newConv && newConv.id) {

    
        convId = newConv.id       

        // Insert all existing messages (including welcome message) but exclude system message
        await supabase
          .from('chats')
          .insert([
            ...messages
              .filter(m => m.type !== 'system') // Exclude system message
              .map(m => {
                return {
                  conversation_id: convId,
                  user_id: userId,
                  message: m.content,
                  sender_type: m.type,
                  created_at: m.timestamp
                }
              }),
          ])       
        // Update the conversationId in parent component
        if (onConversationCreated) {
          onConversationCreated(newConv.id)
        }
      } else {
        setIsLoading(false)
        return
      }
    }
    
    // Insert user message only (not all messages)
    await supabase
      .from('chats')
      .insert([
        {
          conversation_id: convId,
          user_id: userId,
          message: input,
          sender_type: 'user',
        }
      ])

      console.trace("Successfully added user message to conversation")
    // Add user message to UI immediately
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as 'user',
      content: input,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    // Prepare messages for OpenAI API (include existing messages)
    const openAIMessages = messages.map((msg: any) => ({
      role: msg.type === 'user' ? 'user' : msg.type === 'system' ? 'system' : 'assistant',
      content: msg.content,
    })) as any[]
    openAIMessages.push({ role: 'user', content: input })

    // Call OpenAI API (gpt-4o-mini) - using secure route
    let aiContent = ''
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{role: "system", content: SYSTEM_PROMPT},...openAIMessages] })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const rawContent = data.content
      console.trace({rawContent})
      const parsedData: gptResponse = JSON.parse(rawContent)
      //parse the response into a json object later on
      aiContent = parsedData.message
      const action = parsedData.action.toolcall
      const recommendQuery = parsedData.action.recommendQuery
      const toAnalyze = parsedData.action.toAnalyze

      //getting token for requests

      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token
      const header = {headers: {Authorization: `Bearer ${token}`}}
      //checking action and stuff bro
      switch (action) {
        case "recommend":
          // do some recommend api call to backend
          //api/recommend
          console.trace('recommending...')
          console.log('Setting isRecommending to true')
          setIsRecommending(true)

          // use recommend query vro
          const payload = {input: recommendQuery}
          const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taste`
          console.log('POST', endpoint, 'payload:', payload, 'headers:', header)
          let embed;
          try {
            const response = await axios.post(endpoint, payload, header)
            embed = response.data
            console.trace('Taste embedding response:', embed)
          } catch (error: any) {
            if (error.response) {
              console.error('Taste API 400 error:', error.response.data)
              aiContent = `Sorry, there was a problem with your request: ${error.response.data.error || 'Bad Request'}`
            } else {
              console.error('Taste API error:', error)
              aiContent = 'Sorry, there was an error connecting to the taste API.'
            }
            setIsLoading(false)
            setIsRecommending(false)
            break;
          }

          //now to do the recommendation type shi fye
          const recEndpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recommend`
          console.log('POST', recEndpoint, 'payload:', embed, 'headers:', header)
          let recommendResponse;
          try {
            recommendResponse = await axios.post(recEndpoint, embed, header)
          } catch (error: any) {
            if (error.response) {
              console.error('Recommend API 400 error:', error.response.data)
              aiContent = `Sorry, there was a problem with recommendations: ${error.response.data.error || 'Bad Request'}`
            } else {
              console.error('Recommend API error:', error)
              aiContent = 'Sorry, there was an error connecting to the recommendation API.'
            }
            setIsLoading(false)
            setIsRecommending(false)
            break;
          }
          //set up recommendations  
          const recommendationArr = recommendResponse.data.results?.map((m: any, i: number) => {
            return {
              title: m.name,
              type: m.subtype?.split(':').pop(),
              description: recommendResponse.data.explanation?.recommendations[i],
              location: m.address,
              lat: m.location?.lat,
              lon: m.location?.lon
            }
          })
          console.log(recommendationArr)
          if (recommendationArr.length == 0) {
            aiContent = "I searched high and low, but I couldn't find any specific recommendations for you right now. Let me know if you'd like to try a different search or explore something else!"
          }
          setRecommendations(recommendationArr)
          console.log('Setting isRecommending to false')
          setIsRecommending(false)
          console.log(recommendations)
          break;
          case "analyze":
            // api/taste
            console.trace('analyzing')
            console.log('Analyzing user preferences:', toAnalyze || input)
          const response1 = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taste`,
            {input: toAnalyze || input},
            header
          )
          console.log('Taste analysis response:', response1.data)
          break;
        default:
          console.trace('idling')
          break;
      }
      
    } catch (err) {
      console.error('API call error:', err)
      aiContent = 'Sorry, there was an error getting a response from the AI.'
    }
    
    // Save AI message to Supabase
    await supabase
      .from('chats')
      .insert([
        {
          conversation_id: convId,
          user_id: userId,
          message: aiContent,
          sender_type: 'ai',
        }
      ])
    // Add AI message to UI
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai' as 'ai',
      content: aiContent,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, aiMessage])
    setIsLoading(false)
    setIsRecommending(false)
  }

  //find the latest AI message with recommendations
  // const latestAIWithRecs = messages.slice().reverse().find(m => m.type === 'ai' && m.recommendations && m.recommendations.length > 0);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div
        style={{
          background: 'var(--color-bg-primary)',
          color: 'var(--color-text-primary)', 
          position: 'relative',
          minHeight: '100vh',
          height: '100vh',
        }}
        className="flex w-full m-0 p-0 relative overflow-hidden min-h-screen"
      >
      {/* Subtle Radial Gradient Background for Chat Area */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, var(--color-accent) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, var(--color-accent-secondary) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, var(--color-accent-tertiary) 0%, transparent 50%)`,
            opacity: 0.10,
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </div>
      {/* Main Two-Column Layout, flat and flush */}
      <div 
        className="flex flex-row w-full relative z-10 gap-4 md:flex-row flex-col flex-1 min-h-screen h-full transform transition-all duration-700 ease-out"
        style={{
          padding: '10px',
          minHeight: 'calc(100vh - 10px)',
          height: 'calc(100vh - 10px)',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'var(--color-bg-primary)',
          animation: 'fadeInUp 0.8s ease-out forwards'
        }}
      >
        {/* Chat Column, flat */}
        <div
          className="flex flex-col basis-3/5 flex-grow min-w-0 bg-white min-h-0 transform transition-all duration-500 ease-out"
          style={{
            background: 'var(--color-card-bg)',
            border: 'none',
            borderRadius: '16px',
            boxShadow: 'none',
            outline: '2px solid var(--color-card-border)',
            padding: '10px',
            minHeight: 0,
            justifyContent: 'flex-start',
            animation: 'slideInLeft 0.6s ease-out forwards'
          }}
        >
          {/* Header */}
          <header
            style={{
              background: 'transparent',
              color: 'var(--color-text-primary)',
              border: 'none',
              borderRadius: 0,
              boxShadow: 'none',
              padding: '2rem 2rem 0.5rem 2rem',
              marginBlockEnd: '15px',
            }}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center space-x-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 rounded-xl transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg transform hover:-translate-x-1"
                  style={{ color: 'var(--color-text-secondary)', background: 'var(--color-bg-secondary)' }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'var(--color-accent)', borderRadius: '16px' }}>
                <Sparkles className="w-6 h-6" style={{ color: 'var(--color-on-accent)' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>TasteTrip AI</h1>
                <p className="text-base font-medium" style={{ color: 'var(--color-text-secondary)' }}>Your Cultural Discovery Assistant</p>
              </div>
            </div>
            <button
              onClick={() => {
                setMessages([
                  {
                    id: '1',
                    type: 'ai',
                    content: "Hello! I'm your cultural discovery assistant. Tell me about your tastes - what kind of food, music, places, or experiences do you enjoy? I'll help you discover amazing cultural recommendations tailored just for you! ✨",
                    timestamp: new Date(),
                  }
                ])
                setRecommendations([])
                setIsRecommending(false)
                setShowHistory(false)
                if (typeof window !== 'undefined') {
                  window.scrollTo(0, 0)
                }
              }}
              className="ml-4 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg transform hover:-translate-y-1"
              style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
            >
              New Conversation
            </button>
            <div style={{ width: 40 }} /> {/* Placeholder for alignment */}
          </header>
          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-6">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className="message-enter transform transition-all duration-500 ease-out"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animation: 'slideInUp 0.6s ease-out forwards'
                }}
              >
                <MessageBubble message={message} />
              </div>
            ))}
            {isLoading && (
              <div 
                className="message-enter transform transition-all duration-500 ease-out"
                style={{ animation: 'slideInUp 0.6s ease-out forwards' }}
              >
                <MessageBubble
                  message={{
                    id: 'loading',
                    type: 'ai',
                    content: 'Thinking',
                    timestamp: new Date()
                  }}
                  isLoading={true}
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Chat Input */}
          <div
            className="navbar-blur border-t mt-6"
            style={{
              background: 'var(--color-card-bg)',
              border: 'none',
              borderRadius: '16px',
              borderWidth: 0,
              borderStyle: 'none',
              boxShadow: 'none',
              padding: '1rem 2rem',
            }}
          >
            <ChatInput onSubmit={handleUserInput} disabled={isLoading} />
          </div>
        </div>
        {/* Recommendations Column, flat and scrollable */}
        <div
          className="flex flex-col basis-2/5 flex-grow min-w-0 bg-white min-h-0 transform transition-all duration-500 ease-out"
          style={{
            background: 'var(--color-card-bg)',
            border: 'none',
            borderRadius: '16px',
            boxShadow: 'none',
            padding: 0,
            minHeight: 0,
            outline: '2px solid var(--color-card-border)',
            marginLeft: 0,
            borderLeft: 'none',
            animation: 'slideInRight 0.6s ease-out forwards'
          }}
        >
          <div style={{padding: '2rem 2rem 1.5rem 2rem', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1}}>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Recommendations</h2>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {isRecommending ? (
                <div 
                  className="flex items-center justify-center text-gray-400 h-full transform transition-all duration-500 ease-out"
                  style={{ 
                    minHeight: '200px', 
                    color: 'var(--color-text-secondary)',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}
                >
                  Finding recommendations for you...
                </div>
              ) : recommendations.length > 0 ? (
                recommendations.map((rec, recIndex) => (
                  <div
                    key={recIndex}
                    className="transform transition-all duration-700 ease-out"
                    style={{
                      animationDelay: `${recIndex * 200}ms`,
                      animation: 'slideInRight 0.8s ease-out forwards'
                    }}
                  >
                    <RecommendationCard recommendation={rec} />
                  </div>
                ))
              ) : (
                <div 
                  className="flex items-center justify-center text-gray-400 h-full transform transition-all duration-500 ease-out"
                  style={{ 
                    minHeight: '200px', 
                    color: 'var(--color-text-secondary)',
                    animation: 'fadeIn 0.8s ease-out forwards'
                  }}
                >
                  Recommendations will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}