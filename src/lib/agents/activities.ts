import { GoogleGenerativeAI } from '@google/generative-ai'
import { TravelProfile } from '@/types'
import { GEMINI_MODEL } from '../geminiConfig'

const apiKey = process.env.GOOGLE_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

const ACTIVITIES_PROMPT = `Tu es un guide local expert. Crée un planning d'activités personnalisé.

DESTINATION: {DESTINATION}
DURÉE: {DATES}
STYLE/VIBE: {VIBE}
VOYAGEURS: {TRAVELERS}
BUDGET: {BUDGET}

RÈGLES:
- Adapte le nombre d'activités à la durée (3-4 jours: 4-5 activités, 5-7 jours: 6-8 activités)
- Inclus au moins 1 recommandation restaurant
- Groupe par zone géographique
- Adapte au style demandé:
  * détente: activités zen, spa, plages
  * culture: musées, sites historiques, quartiers emblématiques
  * aventure: randonnées, sports, expériences outdoor
  * gastronomie: food tours, marchés, restaurants typiques

FORMAT DE RÉPONSE (JSON):
{
  "activites": [
    {
      "type": "activite",
      "nom": "Nom de l'activité",
      "description": "Description courte + durée estimée",
      "prix": "Gratuit / XX€ / Budget estimé"
    }
  ],
  "restaurants": [
    {
      "type": "restaurant",
      "nom": "Nom du restaurant",
      "description": "Type de cuisine + ambiance",
      "prix": "XX-XX€/personne"
    }
  ],
  "conseil": "Un conseil pratique pour optimiser le séjour"
}

Réponds UNIQUEMENT avec le JSON.`

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

export async function generateActivitiesInfo(profile: TravelProfile): Promise<ActivitiesResult> {
  const emptyResult: ActivitiesResult = {
    activites: [],
    restaurants: [],
    conseil: '',
    success: false,
  }

  if (!genAI) {
    return { ...emptyResult, error: 'API Gemini non configurée' }
  }

  if (!profile.destination) {
    return { ...emptyResult, error: 'Destination manquante' }
  }

  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })

  const prompt = ACTIVITIES_PROMPT
    .replace('{DESTINATION}', profile.destination)
    .replace('{DATES}', profile.dates || '5-7 jours')
    .replace('{VIBE}', profile.vibe || 'culture')
    .replace('{TRAVELERS}', profile.travelers || 'couple')
    .replace('{BUDGET}', profile.budget || 'confort')

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { ...emptyResult, error: 'Format de réponse invalide' }
    }

    const data = JSON.parse(jsonMatch[0])

    return {
      activites: data.activites || [],
      restaurants: data.restaurants || [],
      conseil: data.conseil || '',
      success: true,
    }
  } catch (error) {
    console.error('Erreur agent Activités:', error)
    return { ...emptyResult, error: 'Erreur lors de la génération des activités' }
  }
}
