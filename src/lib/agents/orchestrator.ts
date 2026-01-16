import { TravelProfile } from '@/types'
import Groq from 'groq-sdk'
import { GROQ_MODEL } from '../groqConfig'

const apiKey = process.env.GROQ_API_KEY
const groq = apiKey ? new Groq({ apiKey }) : null

const EMPTY_PROFILE: TravelProfile = {
  destination: null,
  dates: null,
  budget: null,
  travelers: null,
  vibe: null,
  isComplete: false,
  isConfirmed: false,
}

const EXTRACTION_PROMPT = `Tu es un extracteur d'informations de voyage. Analyse la conversation et extrait les informations de profil voyageur.

RÈGLES:
- Retourne UNIQUEMENT un JSON valide, sans texte avant ou après
- Si une information n'est pas mentionnée, utilise null
- Pour "budget", normalise en: "serré", "confort", ou "luxe"
- Pour "vibe", utilise les termes: "détente", "culture", "aventure", "gastronomie", ou une combinaison

Format de sortie EXACT:
{
  "destination": "string ou null",
  "dates": "string ou null",
  "budget": "serré|confort|luxe ou null",
  "travelers": "string ou null",
  "vibe": "string ou null"
}`

export async function extractProfile(
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<TravelProfile> {
  if (!groq) {
    return EMPTY_PROFILE
  }

  // Préparer le contexte de conversation
  const conversationText = messages
    .map((m) => `${m.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${m.content}`)
    .join('\n')

  const prompt = `${EXTRACTION_PROMPT}

CONVERSATION:
${conversationText}

JSON:`

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0,
    })

    const text = completion.choices[0]?.message?.content?.trim() || ''

    // Nettoyer le texte pour extraire le JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return EMPTY_PROFILE
    }

    const extracted = JSON.parse(jsonMatch[0])

    const profile: TravelProfile = {
      destination: extracted.destination || null,
      dates: extracted.dates || null,
      budget: extracted.budget || null,
      travelers: extracted.travelers || null,
      vibe: extracted.vibe || null,
      isComplete: false,
      isConfirmed: false,
    }

    // Vérifier si le profil est complet
    profile.isComplete = !!(
      profile.destination &&
      profile.dates &&
      profile.budget &&
      profile.travelers &&
      profile.vibe
    )

    return profile
  } catch (error) {
    console.error('Erreur extraction profil:', error)
    return EMPTY_PROFILE
  }
}

export function formatProfileSummary(profile: TravelProfile): string {
  const parts: string[] = []

  if (profile.destination) {
    parts.push(`📍 **Destination:** ${profile.destination}`)
  }
  if (profile.dates) {
    parts.push(`📅 **Dates:** ${profile.dates}`)
  }
  if (profile.budget) {
    parts.push(`💰 **Budget:** ${profile.budget}`)
  }
  if (profile.travelers) {
    parts.push(`👥 **Voyageurs:** ${profile.travelers}`)
  }
  if (profile.vibe) {
    parts.push(`✨ **Style:** ${profile.vibe}`)
  }

  return parts.join('\n')
}

export function getMissingFields(profile: TravelProfile): string[] {
  const missing: string[] = []

  if (!profile.destination) missing.push('destination')
  if (!profile.dates) missing.push('dates')
  if (!profile.budget) missing.push('budget')
  if (!profile.travelers) missing.push('voyageurs')
  if (!profile.vibe) missing.push('style de voyage')

  return missing
}

// Import des agents spécialisés
import { generateCultureContext, CultureResult } from './culture'
import { generateFlightsInfo, FlightsResult } from './flights'
import { generateHotelsInfo, HotelsResult } from './hotels'
import { generateActivitiesInfo, ActivitiesResult } from './activities'

export interface ItineraryData {
  culture: CultureResult
  flights: FlightsResult
  hotels: HotelsResult
  activities: ActivitiesResult
}

export async function generateItinerary(profile: TravelProfile): Promise<ItineraryData> {
  // Exécuter tous les agents en parallèle pour plus de rapidité
  const [culture, flights, hotels, activities] = await Promise.all([
    generateCultureContext(profile),
    generateFlightsInfo(profile),
    generateHotelsInfo(profile),
    generateActivitiesInfo(profile),
  ])

  return {
    culture,
    flights,
    hotels,
    activities,
  }
}
