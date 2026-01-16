export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

export interface TravelProfile {
  destination: string | null
  dates: string | null
  budget: string | null
  travelers: string | null
  vibe: string | null
}
