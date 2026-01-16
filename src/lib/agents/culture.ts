import { GoogleGenerativeAI } from '@google/generative-ai'
import { TravelProfile } from '@/types'

const apiKey = process.env.GOOGLE_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

const CULTURE_PROMPT = `Tu es un expert en culture et géopolitique. Fournis un résumé dense et engageant sur la destination.

DESTINATION: {DESTINATION}
PÉRIODE: {DATES}
VOYAGEURS: {TRAVELERS}

CONSIGNES:
1. Parle de la sécurité actuelle (rassure si c'est safe)
2. Donne UN fait culturel unique que peu de touristes connaissent
3. Décris l'accueil des locaux envers les touristes
4. Mentionne un conseil lié à la période/saison

FORMAT: Un paragraphe unique de 150-200 mots, sans liste à puces.
Ton: Immersif et engageant, comme un ami qui connaît bien le pays.

IMPORTANT: Écris en français.`

export interface CultureResult {
  content: string
  success: boolean
  error?: string
}

export async function generateCultureContext(profile: TravelProfile): Promise<CultureResult> {
  if (!genAI) {
    return {
      content: '',
      success: false,
      error: 'API Gemini non configurée',
    }
  }

  if (!profile.destination) {
    return {
      content: '',
      success: false,
      error: 'Destination manquante',
    }
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = CULTURE_PROMPT
    .replace('{DESTINATION}', profile.destination)
    .replace('{DATES}', profile.dates || 'non précisée')
    .replace('{TRAVELERS}', profile.travelers || 'non précisé')

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    return {
      content: text,
      success: true,
    }
  } catch (error) {
    console.error('Erreur agent Culture:', error)
    return {
      content: '',
      success: false,
      error: 'Erreur lors de la génération du contexte culturel',
    }
  }
}
