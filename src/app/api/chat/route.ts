import { NextRequest, NextResponse } from 'next/server'
import { chat } from '@/lib/gemini'
import { PROFILING_PROMPT, CONFIRMATION_PROMPT } from '@/lib/prompts/system-prompts'
import { extractProfile, formatProfileSummary } from '@/lib/agents/orchestrator'
import { TravelProfile } from '@/types'

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

    // Extraire le profil actuel de la conversation
    const profile = await extractProfile(messages)

    // Choisir le prompt en fonction de l'état du profil
    let systemPrompt = PROFILING_PROMPT

    if (profile.isComplete && !profile.isConfirmed) {
      // Profil complet, demander confirmation
      const summary = formatProfileSummary(profile)
      systemPrompt = CONFIRMATION_PROMPT.replace('{PROFILE_SUMMARY}', summary)
    }

    // Ajouter le system prompt au début de la conversation
    const messagesWithSystem = [
      { role: 'user' as const, content: systemPrompt },
      { role: 'assistant' as const, content: "Compris ! Je suis prêt à aider les voyageurs." },
      ...messages,
    ]

    const response = await chat(messagesWithSystem)

    return NextResponse.json({
      response,
      profile,
      phase: getPhase(profile, messages),
    })
  } catch (error) {
    console.error('Erreur API chat:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de la réponse' },
      { status: 500 }
    )
  }
}

function getPhase(
  profile: TravelProfile,
  messages: { role: string; content: string }[]
): string {
  // Vérifier si l'utilisateur a confirmé
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')
  const confirmationKeywords = ['oui', 'ok', 'parfait', 'c\'est bon', 'correct', 'confirme', 'génère', 'go']

  if (profile.isComplete) {
    if (lastUserMessage) {
      const content = lastUserMessage.content.toLowerCase()
      if (confirmationKeywords.some((kw) => content.includes(kw))) {
        return 'confirmed'
      }
    }
    return 'confirming'
  }

  return 'collecting'
}
