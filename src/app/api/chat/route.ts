import { NextRequest, NextResponse } from 'next/server'
import { chat } from '@/lib/gemini'
import { TRAVEL_ASSISTANT_PROMPT } from '@/lib/prompts/system-prompts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages requis' },
        { status: 400 }
      )
    }

    // Ajouter le system prompt au début de la conversation
    const messagesWithSystem = [
      { role: 'user' as const, content: TRAVEL_ASSISTANT_PROMPT },
      { role: 'assistant' as const, content: "Compris ! Je suis prêt à aider les voyageurs." },
      ...messages,
    ]

    const response = await chat(messagesWithSystem)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Erreur API chat:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de la réponse' },
      { status: 500 }
    )
  }
}
