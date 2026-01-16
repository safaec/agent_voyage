import Groq from 'groq-sdk'
import { TravelProfile } from '@/types'
import { GROQ_MODEL } from '../groqConfig'

const apiKey = process.env.GROQ_API_KEY
const groq = apiKey ? new Groq({ apiKey }) : null

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

  if (!groq) {
    return { ...emptyResult, error: 'API Groq non configurée' }
  }

  if (!profile.destination) {
    return { ...emptyResult, error: 'Destination manquante' }
  }

  const prompt = ACTIVITIES_PROMPT
    .replace('{DESTINATION}', profile.destination)
    .replace('{DATES}', profile.dates || '5-7 jours')
    .replace('{VIBE}', profile.vibe || 'culture')
    .replace('{TRAVELERS}', profile.travelers || 'couple')
    .replace('{BUDGET}', profile.budget || 'confort')

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const text = completion.choices[0]?.message?.content?.trim() || ''

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
