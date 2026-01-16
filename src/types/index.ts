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
  isComplete: boolean
  isConfirmed: boolean
}

export type ProfilingPhase =
  | 'collecting'    // En train de collecter les infos
  | 'confirming'    // Demande de confirmation
  | 'confirmed'     // Profil confirmé, prêt pour génération
  | 'generating'    // Génération de l'itinéraire en cours

export interface ConversationState {
  phase: ProfilingPhase
  profile: TravelProfile
  messages: Message[]
}
