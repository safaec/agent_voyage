'use client'

import { useState, useRef, useEffect } from 'react'
import { Message, TravelProfile, ProfilingPhase, ItineraryData } from '@/types'
import { MessageBubble } from './MessageBubble'
import { ProfileSidebar } from './ProfileSidebar'
import ItineraryReport from './ItineraryReport'

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Bonjour ! Je suis votre assistant de voyage. 🌍

Je vais vous aider à créer un itinéraire personnalisé en 5 questions simples.

Pour commencer, quelle destination vous fait rêver ?`,
  timestamp: new Date(),
}

const EMPTY_PROFILE: TravelProfile = {
  destination: null,
  dates: null,
  budget: null,
  travelers: null,
  vibe: null,
  isComplete: false,
  isConfirmed: false,
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<TravelProfile>(EMPTY_PROFILE)
  const [phase, setPhase] = useState<ProfilingPhase>('collecting')
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Déclencher la génération quand le profil est confirmé
  useEffect(() => {
    if (phase === 'confirmed' && profile.isComplete && !itinerary && !isGenerating) {
      generateItinerary()
    }
  }, [phase, profile.isComplete])

  const generateItinerary = async () => {
    setIsGenerating(true)
    setPhase('generating')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      })

      if (!response.ok) {
        throw new Error('Erreur de génération')
      }

      const data = await response.json()

      if (data.success && data.itinerary) {
        setItinerary(data.itinerary)
      }
    } catch (error) {
      console.error('Erreur génération:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Désolé, une erreur s'est produite lors de la génération de votre itinéraire. Veuillez réessayer.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setPhase('confirmed')
    } finally {
      setIsGenerating(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur de connexion')
      }

      const data = await response.json()

      // Mettre à jour le profil et la phase
      if (data.profile) {
        setProfile(data.profile)
      }
      if (data.phase) {
        setPhase(data.phase as ProfilingPhase)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Erreur:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - Profil (visible sur desktop) */}
      <ProfileSidebar profile={profile} phase={phase} />

      {/* Chat principal */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-4 shadow-md">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <span className="text-2xl">✈️</span>
            <div>
              <h1 className="font-semibold text-lg">Agent Voyage</h1>
              <p className="text-blue-100 text-sm">
                {phase === 'collecting' && 'Profilage en cours...'}
                {phase === 'confirming' && 'Confirmation du profil'}
                {phase === 'confirmed' && 'Profil confirmé !'}
                {phase === 'generating' && 'Génération de l\'itinéraire...'}
              </p>
            </div>
          </div>
        </header>

        {/* Messages ou Itinéraire */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {itinerary ? (
            // Afficher l'itinéraire généré
            <div className="pb-6">
              <ItineraryReport itinerary={itinerary} profile={profile} />
            </div>
          ) : (
            // Afficher le chat
            <div className="max-w-3xl mx-auto">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">✈️</span>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isGenerating && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl rounded-bl-md px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl animate-pulse">✨</span>
                      <div>
                        <p className="font-medium text-gray-800">Génération de votre itinéraire...</p>
                        <p className="text-sm text-gray-600">Nos agents analysent les meilleures options pour vous</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input - masqué quand l'itinéraire est affiché */}
        {!itinerary && (
          <div className="border-t bg-white px-4 py-4">
            <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isGenerating ? "Génération en cours..." : "Écrivez votre message..."}
                className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                disabled={isLoading || isGenerating}
              />
              <button
                type="submit"
                disabled={isLoading || isGenerating || !input.trim()}
                className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Envoyer
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
