import Groq from 'groq-sdk'
import { TravelProfile } from '@/types'
import { GROQ_MODEL } from '../groqConfig'

const apiKey = process.env.GROQ_API_KEY
const groq = apiKey ? new Groq({ apiKey }) : null

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
  if (!groq) {
    return {
      content: '',
      success: false,
      error: 'API Groq non configurée',
    }
  }

  if (!profile.destination) {
    return {
      content: '',
      success: false,
      error: 'Destination manquante',
    }
  }

  const prompt = CULTURE_PROMPT
    .replace('{DESTINATION}', profile.destination)
    .replace('{DATES}', profile.dates || 'non précisée')
    .replace('{TRAVELERS}', profile.travelers || 'non précisé')

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    })

    const text = completion.choices[0]?.message?.content?.trim() || ''

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
