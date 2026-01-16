# Code Patterns & Conventions - Agent Voyage

## Architecture Pattern

### Separation of Concerns
```
src/
├── app/           # Routes et pages (UI uniquement)
├── components/    # Composants réutilisables
├── lib/           # Logique métier et utilitaires
│   ├── agents/    # Logique des 5 agents IA
│   ├── prompts/   # System prompts
│   └── gemini.ts  # Client API
└── types/         # Types TypeScript
```

### Rule: No Business Logic in Pages
```typescript
// BAD - logique dans la page
// app/chat/page.tsx
export default function ChatPage() {
  const handleSubmit = async () => {
    const model = genAI.getGenerativeModel({...}); // NON!
    // ...
  }
}

// GOOD - logique déléguée à lib/
// app/chat/page.tsx
import { processUserMessage } from '@/lib/agents/orchestrator';

export default function ChatPage() {
  const handleSubmit = async () => {
    const response = await processUserMessage(message);
  }
}
```

## Naming Conventions

### Files
- **Components:** PascalCase → `ChatInterface.tsx`
- **Utilities:** camelCase → `orchestrator.ts`
- **Types:** camelCase → `index.ts`

### Variables & Functions
```typescript
// Variables: camelCase
const userProfile = {};
const isLoading = false;

// Functions: camelCase, verbe + nom
function extractUserProfile() {}
function generateItinerary() {}
async function callAgentWithSearch() {}

// Components: PascalCase
function MessageBubble() {}
function ItineraryReport() {}

// Types/Interfaces: PascalCase
interface UserProfile {}
type BudgetLevel = 'economique' | 'modere';
```

## Component Patterns

### Client Component avec State
```typescript
'use client';

import { useState } from 'react';
import { ChatMessage } from '@/types';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      // Update messages...
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
}
```

### API Route Pattern
```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { processUserMessage } from '@/lib/agents/orchestrator';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      );
    }

    const response = await processUserMessage(message, history);
    return NextResponse.json({ response });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
```

## Agent Pattern

### System Prompt Structure
```typescript
// lib/prompts/system-prompts.ts

export const ORCHESTRATOR_PROMPT = `
Tu es l'assistant voyage Agent Voyage.

CONTEXTE:
Tu aides les utilisateurs à planifier leur voyage en collectant leurs préférences.

PHASE ACTUELLE: Profilage

QUESTIONS À COLLECTER:
1. destination - Où souhaitez-vous partir ?
2. dates - Quand souhaitez-vous voyager ?
3. budget - Quel est votre budget ? (économique/modéré/confortable/luxe)
4. travelers - Qui voyage avec vous ?
5. vibe - Quel type de voyage ? (détente/culture/aventure/gastronomie)

RÈGLES:
- Pose UNE question à la fois de manière conversationnelle
- Extrais les informations des réponses utilisateur
- Confirme le profil complet avant de générer l'itinéraire
- Réponds toujours en français avec un ton chaleureux
`;

export const CULTURE_AGENT_PROMPT = `
Tu es SYS_01, expert en culture et géopolitique des destinations.

MISSION:
Rédiger un paragraphe de 150-200 mots sur la destination incluant:
- Contexte culturel principal
- Situation géopolitique/sécuritaire (si pertinent)
- Meilleure période pour visiter
- Un "fun fact" mémorable

FORMAT: Texte fluide, pas de bullet points. Ton inspirant.
`;
```

### Agent Implementation
```typescript
// lib/agents/culture.ts
import { callAgent } from '../gemini';
import { CULTURE_AGENT_PROMPT } from '../prompts/system-prompts';
import { UserProfile } from '@/types';

export async function generateCultureContext(profile: UserProfile): Promise<string> {
  const userMessage = `
    Destination: ${profile.destination}
    Période: ${profile.dates}
    Type de voyage: ${profile.vibe.join(', ')}
    Voyageurs: ${profile.travelers}
  `;

  const response = await callAgent(CULTURE_AGENT_PROMPT, userMessage);
  return response;
}
```

## Error Handling

### Pattern: User-Friendly Errors
```typescript
// Toujours attraper les erreurs et retourner un message clair
try {
  const result = await generateItinerary(profile);
  return result;
} catch (error) {
  console.error('Erreur génération:', error);
  return {
    error: true,
    message: "Désolé, je n'ai pas pu générer votre itinéraire. Veuillez réessayer."
  };
}
```

### Pattern: Never Invent Data
```typescript
// Pour les agents avec web search (vols, hôtels)
const FLIGHTS_AGENT_PROMPT = `
...
RÈGLE CRITIQUE:
- Ne JAMAIS inventer de prix
- Si la recherche échoue, indiquer: "Prix non disponible - consultez Skyscanner/Google Flights"
- Toujours citer la source des prix trouvés
`;
```

## Styling Patterns

### Tailwind Classes
```typescript
// Utiliser des classes utilitaires cohérentes
<div className="bg-[#FDF6EC] min-h-screen">
  <h1 className="font-['Playfair_Display'] text-4xl text-[#3D405B]">
    Agent Voyage
  </h1>
  <button className="bg-[#E07A5F] hover:bg-[#d06a4f] text-white px-6 py-3 rounded-lg transition-colors">
    Commencer
  </button>
</div>
```

### Message Bubbles
```typescript
// User message (right, primary color)
<div className="ml-auto max-w-[80%] bg-[#E07A5F] text-white rounded-2xl rounded-br-sm px-4 py-2">
  {message}
</div>

// Assistant message (left, light)
<div className="mr-auto max-w-[80%] bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2">
  {message}
</div>
```

## Import Conventions

```typescript
// 1. React/Next imports
import { useState, useEffect } from 'react';
import { NextRequest, NextResponse } from 'next/server';

// 2. External libraries
import { GoogleGenerativeAI } from '@google/generative-ai';

// 3. Internal imports (use @ alias)
import { UserProfile } from '@/types';
import { callAgent } from '@/lib/gemini';
import { ChatInterface } from '@/components/ChatInterface';
```
