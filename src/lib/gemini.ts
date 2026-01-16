import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GOOGLE_API_KEY

if (!apiKey) {
  console.warn('GOOGLE_API_KEY non définie - le chat ne fonctionnera pas')
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

export async function chat(
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  if (!genAI) {
    throw new Error('Clé API Gemini non configurée')
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  // Convertir les messages au format Gemini
  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))

  const chat = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.7,
    },
  })

  const lastMessage = messages[messages.length - 1]
  const result = await chat.sendMessage(lastMessage.content)
  const response = result.response

  return response.text()
}
