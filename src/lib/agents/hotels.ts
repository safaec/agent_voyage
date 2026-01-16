import { GoogleGenerativeAI } from '@google/generative-ai'
import { TravelProfile } from '@/types'

const apiKey = process.env.GOOGLE_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

const HOTELS_PROMPT = `Tu es un expert hôtelier. Trouve 3 hôtels correspondant au profil.

DESTINATION: {DESTINATION}
BUDGET: {BUDGET}
VOYAGEURS: {TRAVELERS}
STYLE: {VIBE}

TROUVE EXACTEMENT 3 HÔTELS:
1. **Best Value** - Meilleur rapport qualité/prix
2. **Expérience** - Vue incroyable, historique ou design unique
3. **Pratique** - Localisation centrale, idéal pour explorer

Pour chaque hôtel:
- Nom réaliste et crédible (pas forcément réel, mais réaliste)
- Quartier/zone de la ville
- Prix estimé par nuit selon le budget
- 3 points forts

ADAPTATION AU BUDGET:
- serré: 30-80€/nuit
- confort: 80-150€/nuit
- luxe: 150-400€/nuit

FORMAT DE RÉPONSE (JSON):
{
  "hotels": [
    {
      "type": "Best Value",
      "nom": "Nom de l'hôtel",
      "quartier": "Quartier",
      "prix": "XX€/nuit",
      "points_forts": "3 mots séparés par virgules"
    },
    {
      "type": "Expérience",
      "nom": "...",
      "quartier": "...",
      "prix": "...",
      "points_forts": "..."
    },
    {
      "type": "Pratique",
      "nom": "...",
      "quartier": "...",
      "prix": "...",
      "points_forts": "..."
    }
  ]
}

Réponds UNIQUEMENT avec le JSON.`

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

export async function generateHotelsInfo(profile: TravelProfile): Promise<HotelsResult> {
  const emptyResult: HotelsResult = {
    hotels: [],
    success: false,
  }

  if (!genAI) {
    return { ...emptyResult, error: 'API Gemini non configurée' }
  }

  if (!profile.destination) {
    return { ...emptyResult, error: 'Destination manquante' }
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = HOTELS_PROMPT
    .replace('{DESTINATION}', profile.destination)
    .replace('{BUDGET}', profile.budget || 'confort')
    .replace('{TRAVELERS}', profile.travelers || 'couple')
    .replace('{VIBE}', profile.vibe || 'culture')

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { ...emptyResult, error: 'Format de réponse invalide' }
    }

    const data = JSON.parse(jsonMatch[0])

    return {
      hotels: data.hotels || [],
      success: true,
    }
  } catch (error) {
    console.error('Erreur agent Hôtels:', error)
    return { ...emptyResult, error: 'Erreur lors de la recherche d\'hôtels' }
  }
}
