import Groq from 'groq-sdk'
import { GROQ_MODEL } from './groqConfig'

const apiKey = process.env.GROQ_API_KEY

if (!apiKey) {
  console.warn('GROQ_API_KEY non définie - le chat ne fonctionnera pas')
}

const groq = apiKey ? new Groq({ apiKey }) : null

export async function chat(
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  if (!groq) {
    throw new Error('Clé API Groq non configurée')
  }

  // Convertir les messages au format Groq/OpenAI
  const formattedMessages = messages.map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }))

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: formattedMessages,
    max_tokens: 1000,
    temperature: 0.7,
  })

  return completion.choices[0]?.message?.content || ''
}
