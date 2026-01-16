import { NextRequest, NextResponse } from 'next/server'
import { generateItinerary } from '@/lib/agents/orchestrator'
import { TravelProfile } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profile } = body as { profile: TravelProfile }

    if (!profile || !profile.isComplete) {
      return NextResponse.json(
        { error: 'Profil incomplet' },
        { status: 400 }
      )
    }

    // Générer l'itinéraire avec tous les agents
    const itinerary = await generateItinerary(profile)

    return NextResponse.json({
      success: true,
      itinerary,
      profile,
    })
  } catch (error) {
    console.error('Erreur génération itinéraire:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'itinéraire' },
      { status: 500 }
    )
  }
}
