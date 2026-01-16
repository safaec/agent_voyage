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

// Types pour les agents spécialisés
export interface CultureResult {
  content: string
  success: boolean
  error?: string
}

export interface FlightsResult {
  periode: string
  prix: string
  compagnies: string
  conseil: string
  success: boolean
  error?: string
}

export interface Hotel {
  type: string
  nom: string
  quartier: string
  prix: string
  points_forts: string
}

export interface HotelsResult {
  hotels: Hotel[]
  success: boolean
  error?: string
}

export interface Activity {
  type: string
  nom: string
  description: string
  prix: string
}

export interface ActivitiesResult {
  activites: Activity[]
  restaurants: Activity[]
  conseil: string
  success: boolean
  error?: string
}

export interface ItineraryData {
  culture: CultureResult
  flights: FlightsResult
  hotels: HotelsResult
  activities: ActivitiesResult
}
