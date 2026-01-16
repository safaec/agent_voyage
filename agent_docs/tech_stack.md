# Tech Stack & Tools - Agent Voyage

## Stack Principal

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Fonts:** Playfair Display (headings) + Inter (body)

### Backend
- **API Routes:** Next.js API Routes (pas de backend séparé)
- **AI Provider:** Google Gemini API (gemini-2.0-flash)
- **Web Search:** Google Search Grounding (intégré à Gemini)

### Deployment
- **Hosting:** Vercel (free tier)
- **Environment:** Variables via Vercel Dashboard
- **CI/CD:** Auto-deploy on git push

## Installation Commands

```bash
# Créer le projet
npx create-next-app@latest agent-voyage --typescript --tailwind --eslint --app --src-dir

# Entrer dans le projet
cd agent-voyage

# Installer Gemini SDK
npm install @google/generative-ai

# Installer shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button input card scroll-area avatar

# Lancer en dev
npm run dev
```

## Configuration Requise

### .env.local (NE JAMAIS COMMIT)
```
GOOGLE_API_KEY=AIza...votre_cle_ici
```

### Obtenir la clé Gemini
1. Aller sur [aistudio.google.com](https://aistudio.google.com)
2. Cliquer "Get API Key"
3. Copier la clé dans .env.local

## Gemini API - Usage

### Client de base
```typescript
// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Agent SANS web search (SYS_01, SYS_04)
export async function callAgent(systemPrompt: string, userMessage: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt
  });
  const result = await model.generateContent(userMessage);
  return result.response.text();
}

// Agent AVEC web search (SYS_02, SYS_03)
export async function callAgentWithSearch(systemPrompt: string, userMessage: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
    tools: [{ googleSearch: {} }]
  });
  const result = await model.generateContent(userMessage);
  return result.response.text();
}
```

## Limites Free Tier Gemini
- 60 requêtes/minute
- 1 500 requêtes/jour
- 1 million tokens de contexte
- Google Search Grounding inclus

## Palette de Couleurs

```css
/* globals.css */
:root {
  --primary: #E07A5F;        /* Terracotta - chaleureux */
  --primary-light: #F2CC8F;  /* Sable doré */
  --secondary: #3D405B;      /* Bleu nuit - confiance */
  --accent: #81B29A;         /* Vert sauge */
  --bg-light: #FDF6EC;       /* Crème chaud */
  --text-primary: #2D2D2D;
  --text-secondary: #6B7280;
}
```

## Structure des Types

```typescript
// src/types/index.ts

export interface UserProfile {
  destination: string;
  dates: string;
  budget: 'economique' | 'modere' | 'confortable' | 'luxe';
  travelers: string;
  vibe: ('detente' | 'culture' | 'aventure' | 'gastronomie')[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ItineraryReport {
  destination: string;
  culture: string;
  flights: FlightInfo;
  hotels: HotelOption[];
  activities: Activity[];
  budget: BudgetSummary;
}
```

## Versions Recommandées
- Node.js: 18.x ou 20.x
- npm: 9.x ou 10.x
- Next.js: 14.x
- TypeScript: 5.x
