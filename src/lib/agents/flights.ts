import Groq from 'groq-sdk'
import { TravelProfile } from '@/types'
import { GROQ_MODEL } from '../groqConfig'

const apiKey = process.env.GROQ_API_KEY
const groq = apiKey ? new Groq({ apiKey }) : null

const FLIGHTS_PROMPT = `Tu es un expert en yield management aérien. Analyse les vols vers la destination.

DESTINATION: {DESTINATION}
PÉRIODE SOUHAITÉE: {DATES}
BUDGET: {BUDGET}
DÉPART: Paris (par défaut)

CONSIGNES:
1. Identifie la meilleure période pour des vols pas chers
2. Estime une fourchette de prix réaliste pour un A/R
3. Liste les principales compagnies aériennes sur cette route
4. Donne un conseil tactique de réservation

IMPORTANT:
- Ne JAMAIS inventer de prix précis
- Donne des fourchettes réalistes basées sur tes connaissances
- Si incertain, indique "Prix à vérifier sur Skyscanner/Google Flights"

FORMAT DE RÉPONSE (JSON):
{
  "periode": "Mois ou période recommandée",
  "prix": "Fourchette de prix A/R (ex: 500-800€)",
  "compagnies": "Liste des compagnies principales",
  "conseil": "Conseil tactique de réservation"
}

Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`

export interface FlightsResult {
  periode: string
  prix: string
  compagnies: string
  conseil: string
  success: boolean
  error?: string
}

export async function generateFlightsInfo(profile: TravelProfile): Promise<FlightsResult> {
  const emptyResult: FlightsResult = {
    periode: 'Non disponible',
    prix: 'Prix à vérifier sur Skyscanner',
    compagnies: 'Non disponible',
    conseil: 'Consultez Google Flights pour les meilleurs tarifs',
    success: false,
  }

  if (!groq) {
    return { ...emptyResult, error: 'API Groq non configurée' }
  }

  if (!profile.destination) {
    return { ...emptyResult, error: 'Destination manquante' }
  }

  const prompt = FLIGHTS_PROMPT
    .replace('{DESTINATION}', profile.destination)
    .replace('{DATES}', profile.dates || 'flexible')
    .replace('{BUDGET}', profile.budget || 'confort')

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.5,
    })

    const text = completion.choices[0]?.message?.content?.trim() || ''

    // Extraire le JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { ...emptyResult, error: 'Format de réponse invalide' }
    }

    const data = JSON.parse(jsonMatch[0])

    return {
      periode: data.periode || emptyResult.periode,
      prix: data.prix || emptyResult.prix,
      compagnies: data.compagnies || emptyResult.compagnies,
      conseil: data.conseil || emptyResult.conseil,
      success: true,
    }
  } catch (error) {
    console.error('Erreur agent Vols:', error)
    return { ...emptyResult, error: 'Erreur lors de la recherche de vols' }
  }
}
