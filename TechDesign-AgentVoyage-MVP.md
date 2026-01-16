# Technical Design Document: Agent Voyage MVP

## 🛠 How We'll Build It

### Recommended Approach: Next.js + Gemini API + Vercel

Based on your requirements (1-2 weeks, budget gratuit, L'IA écrit tout le code), voici le chemin optimal :

**🏆 Primary Recommendation: Next.js 14 + Gemini API + Vercel**

- **Why it's perfect for you:**
  1. Next.js est le framework le mieux documenté - l'IA le connaît parfaitement
  2. Vercel offre un déploiement gratuit en un clic
  3. Gemini API a un **free tier très généreux** (60 requêtes/minute gratuit)
  4. Gemini possède un **contexte de 1M tokens** - parfait pour des itinéraires complexes
  5. **Google Search intégré** via Grounding - idéal pour les prix vols/hôtels
  6. Pas besoin de backend séparé - les API Routes de Next.js suffisent
- **What it costs:** $0/mois (free tier Gemini très généreux)
- **Time to learn:** 0 - L'IA code tout, vous testez
- **Limitations to know:**
  - Free tier = 60 req/min, 1500 req/jour (largement suffisant pour MVP)
  - Pas de persistance des conversations sans base de données

### Alternative Options Compared

| Option | Pros | Cons | Cost | Time to MVP |
|--------|------|------|------|-------------|
| **Next.js + Gemini API** (Recommandé) | Free tier généreux, Google Search intégré, 1M context | API plus récente | **$0** | 1-2 semaines |
| **Next.js + Claude API** | Très bon pour le code | Pas de free tier généreux | $5-20/mo | 1-2 semaines |
| **Bolt.new / Lovable** | Zéro code, très rapide | Limité pour logique multi-agent complexe | $0-20/mo | 3-5 jours |

**Pourquoi Gemini gagne :** Free tier généreux + Google Search natif pour les prix en temps réel + contexte 1M tokens pour des itinéraires détaillés.

---

## 📋 Project Setup Checklist

### Step 1: Create Accounts (Day 1)

- [ ] **Google AI Studio** - [aistudio.google.com](https://aistudio.google.com) - Pour la clé API Gemini (gratuit)
- [ ] **Vercel** - [vercel.com](https://vercel.com) - Hébergement gratuit
- [ ] **GitHub** - [github.com](https://github.com) - Stockage du code

### Step 2: AI Assistant Setup (Day 1)

- [ ] Ouvrir **Cursor** (que vous connaissez déjà)
- [ ] Créer un nouveau projet

### Step 3: Project Initialization (Day 1)

```bash
# Dans Cursor, ouvrir le terminal et exécuter :
npx create-next-app@latest agent-voyage --typescript --tailwind --eslint --app --src-dir

# Entrer dans le projet
cd agent-voyage

# Installer le SDK Google Generative AI
npm install @google/generative-ai

# Lancer en local
npm run dev
```

Votre app sera accessible sur `http://localhost:3000`

---

## 🏗 Architecture du Système Multi-Agent

### Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Page      │    │  Interface  │    │   Rapport   │     │
│  │  d'Accueil  │───▶│    Chat     │───▶│    Final    │     │
│  └─────────────┘    └──────┬──────┘    └─────────────┘     │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │ API Route
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (API Routes)                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              /api/chat - Orchestrator                 │  │
│  │                                                       │  │
│  │  Phase 1: Profilage (5 questions)                    │  │
│  │      ↓                                               │  │
│  │  Phase 2: Exécution séquentielle                     │  │
│  │      ├── SYS_01: Culture (Gemini)                    │  │
│  │      ├── SYS_02: Vols (Gemini + Google Search)       │  │
│  │      ├── SYS_03: Hôtels (Gemini + Google Search)     │  │
│  │      └── SYS_04: Activités (Gemini)                  │  │
│  │      ↓                                               │  │
│  │  Phase 3: Compilation rapport final                  │  │
│  │      ↓                                               │  │
│  │  Phase 4: Follow-up (triage)                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      GEMINI API                              │
│  - gemini-2.0-flash (rapide, gratuit, 1M context)           │
│  - Google Search Grounding (pour SYS_02 et SYS_03)          │
└─────────────────────────────────────────────────────────────┘
```

### Structure des Fichiers

```
agent-voyage/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Page d'accueil
│   │   ├── chat/
│   │   │   └── page.tsx          # Interface de chat
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts      # API endpoint principal
│   │   └── globals.css           # Styles globaux
│   │
│   ├── components/
│   │   ├── ChatInterface.tsx     # Composant chat
│   │   ├── MessageBubble.tsx     # Bulle de message
│   │   ├── ItineraryReport.tsx   # Affichage du rapport
│   │   └── LoadingIndicator.tsx  # Indicateur de chargement
│   │
│   ├── lib/
│   │   ├── agents/
│   │   │   ├── orchestrator.ts   # SYS_00 - Logique principale
│   │   │   ├── culture.ts        # SYS_01 - Agent culture
│   │   │   ├── flights.ts        # SYS_02 - Agent vols
│   │   │   ├── hotels.ts         # SYS_03 - Agent hôtels
│   │   │   └── activities.ts     # SYS_04 - Agent activités
│   │   │
│   │   ├── prompts/
│   │   │   ├── system-prompts.ts # Tous les system prompts
│   │   │   └── templates.ts      # Template du rapport final
│   │   │
│   │   └── gemini.ts             # Client Gemini API
│   │
│   └── types/
│       └── index.ts              # Types TypeScript
│
├── .env.local                    # Clé API (NE PAS COMMIT)
├── package.json
└── README.md
```

---

## 🔧 Building Your Features

### Feature 1: Interface de Chat Conversationnelle

**Complexity:** ⭐⭐☆☆☆ (Easy)

**Prompt pour Cursor:**
```
Create a chat interface component in Next.js with:
- A message history display area with scrolling
- User messages on the right (blue bubbles)
- Assistant messages on the left (gray bubbles)
- An input field at the bottom with send button
- Loading indicator while waiting for response
- Use Tailwind CSS with warm, travel-inspired colors
- Mobile responsive design

The chat should call /api/chat endpoint with POST request.
Store conversation history in React state.
```

**Files to create:**
- `src/components/ChatInterface.tsx` - Composant principal
- `src/components/MessageBubble.tsx` - Affichage des messages

**Test:** Envoyer un message et voir qu'il s'affiche

---

### Feature 2: Système de Profilage (5 Questions)

**Complexity:** ⭐⭐☆☆☆ (Easy)

**Logique de l'Orchestrator:**

```typescript
// src/lib/agents/orchestrator.ts

const PROFILING_QUESTIONS = [
  "destination",    // Q1: Où souhaitez-vous partir ?
  "dates",          // Q2: Quand souhaitez-vous voyager ?
  "budget",         // Q3: Quel est votre budget ?
  "travelers",      // Q4: Qui voyage avec vous ?
  "vibe"            // Q5: Quel type de voyage ?
];

interface UserProfile {
  destination: string | null;
  dates: string | null;
  budget: string | null;
  travelers: string | null;
  vibe: string | null;
}

// L'orchestrator vérifie quelles questions ont été répondues
// et pose la suivante de manière conversationnelle
```

**Prompt pour Cursor:**
```
Create an orchestrator module that:
1. Tracks which of 5 profile questions have been answered
2. Extracts answers from user messages using Gemini
3. Asks the next question conversationally in French
4. Confirms the complete profile before generating itinerary

Questions to collect:
- destination: Where they want to go
- dates: When (month/season or specific dates)
- budget: Budget level (économique/modéré/confortable/luxe)
- travelers: Solo, couple, family with kids ages, friends
- vibe: détente, culture, aventure, gastronomie (can be multiple)

Use Gemini to intelligently parse user responses.
```

---

### Feature 3: Génération d'Itinéraire (Agents Séquentiels)

**Complexity:** ⭐⭐⭐☆☆ (Medium)

**Flux d'exécution des agents:**

```
Profile complet
     │
     ▼
┌─────────────────┐
│  SYS_01_CULTURE │ ──▶ Paragraphe 150-200 mots
└────────┬────────┘     (contexte, sécurité, fun fact)
         │
         ▼
┌─────────────────┐
│  SYS_02_VOLS    │ ──▶ Période recommandée + prix + compagnies
└────────┬────────┘     (AVEC Google Search)
         │
         ▼
┌─────────────────┐
│  SYS_03_HOTELS  │ ──▶ 3 options (value, expérience, pratique)
└────────┬────────┘     (AVEC Google Search)
         │
         ▼
┌─────────────────┐
│ SYS_04_ACTIVITES│ ──▶ 4-8 activités + restaurants
└────────┬────────┘     (adaptées au vibe et durée)
         │
         ▼
   Rapport Final
```

**Prompt pour chaque agent (exemple SYS_02_VOLS):**

```
Tu es SYS_02, un expert en yield management aérien.

PROFIL UTILISATEUR:
- Destination: {destination}
- Période: {dates}
- Budget: {budget}
- Voyageurs: {travelers}

MISSION:
1. Recherche les prix actuels des vols vers {destination}
2. Identifie la meilleure période tarifaire
3. Liste les compagnies principales sur cette route

FORMAT DE SORTIE:
- Période recommandée: [mois/semaines]
- Prix moyen A/R: [prix avec source]
- Compagnies: [liste]
- Conseil tactique: [astuce pour économiser]

RÈGLE CRITIQUE: Ne jamais inventer de prix. Si la recherche échoue, indiquer "Prix non disponible actuellement - consulter Skyscanner/Google Flights"
```

---

### Feature 4: Recherche Web (Vols & Hôtels)

**Complexity:** ⭐⭐⭐☆☆ (Medium - Gemini le fait pour vous)

**Utilisation du Google Search Grounding de Gemini:**

```typescript
// src/lib/gemini.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Pour les agents qui ont besoin de recherche web (SYS_02, SYS_03)
export async function callAgentWithGoogleSearch(
  systemPrompt: string,
  userMessage: string
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
    tools: [{
      googleSearch: {}  // Active Google Search Grounding
    }]
  });

  const result = await model.generateContent(userMessage);
  return result.response.text();
}

// Pour les agents sans recherche web (SYS_01, SYS_04)
export async function callAgent(
  systemPrompt: string,
  userMessage: string
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt
  });

  const result = await model.generateContent(userMessage);
  return result.response.text();
}

// Pour le chat conversationnel avec historique
export async function callAgentWithHistory(
  systemPrompt: string,
  history: { role: string; parts: { text: string }[] }[],
  userMessage: string
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt
  });

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}
```

**Avantage Gemini:** Google Search Grounding donne accès aux résultats Google actuels, parfait pour les prix de vols et hôtels en temps réel.

---

### Feature 5: Gestion des Follow-ups (Triage)

**Complexity:** ⭐⭐☆☆☆ (Easy)

**Logique de triage:**

```typescript
// Types de follow-up
enum FollowUpCategory {
  CLARIFICATION = 1,  // Questions simples → Réponse directe
  MINOR_ADJUSTMENT = 2, // Changer un hôtel → Réactiver 1 agent
  MAJOR_CHANGE = 3     // Changer destination → Restart complet
}

// Prompt pour classifier le follow-up
const TRIAGE_PROMPT = `
Analyse la demande de l'utilisateur et classifie-la:

CATÉGORIE 1 - Clarification:
Exemples: "C'est quoi le hanami?", "Shibuya est sûr?", "120€/nuit c'est cher?"
→ Répondre directement sans réactiver d'agent

CATÉGORIE 2 - Ajustement mineur:
Exemples: "Trouve un hôtel moins cher", "Ajoute une activité culturelle", "Restaurant végétarien?"
→ Réactiver uniquement l'agent concerné

CATÉGORIE 3 - Changement majeur:
Exemples: "Finalement on va à Osaka", "2 semaines au lieu d'une", "Budget doublé"
→ Relancer le profilage complet

Réponds avec: CATEGORY_1, CATEGORY_2_[AGENT], ou CATEGORY_3
`;
```

---

## 🎨 Design Implementation

### Matching Your PRD Vision: "Chaleureux, inspirant, voyage"

**Color Palette:**
```css
/* src/app/globals.css */

:root {
  /* Couleurs principales - tons chauds voyage */
  --primary: #E07A5F;        /* Terracotta - chaleureux */
  --primary-light: #F2CC8F;  /* Sable doré - inspirant */
  --secondary: #3D405B;      /* Bleu nuit - confiance */
  --accent: #81B29A;         /* Vert sauge - naturel */

  /* Backgrounds */
  --bg-light: #FDF6EC;       /* Crème chaud */
  --bg-dark: #2D2D2D;        /* Mode sombre */

  /* Text */
  --text-primary: #2D2D2D;
  --text-secondary: #6B7280;
  --text-light: #FFFFFF;
}
```

**Typography:**
```css
/* Google Fonts à ajouter dans layout.tsx */
--font-heading: 'Playfair Display', serif;  /* Élégant, voyage */
--font-body: 'Inter', sans-serif;           /* Lisible, moderne */
```

### Templates UI Recommandés

1. **shadcn/ui** - [ui.shadcn.com](https://ui.shadcn.com)
   - Composants prêts à l'emploi
   - Facile à personnaliser
   - Très bien documenté

**Installation:**
```bash
npx shadcn@latest init
npx shadcn@latest add button input card scroll-area
```

---

## 📊 Structure des Données

### Types TypeScript

```typescript
// src/types/index.ts

// Profil utilisateur collecté pendant le profilage
export interface UserProfile {
  destination: string;
  dates: string;
  budget: 'economique' | 'modere' | 'confortable' | 'luxe';
  travelers: string;
  vibe: ('detente' | 'culture' | 'aventure' | 'gastronomie')[];
}

// Message dans le chat
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Rapport d'itinéraire généré
export interface ItineraryReport {
  destination: string;
  periode: string;
  culture: string;           // Paragraphe SYS_01
  flights: FlightInfo;       // Sortie SYS_02
  hotels: HotelOption[];     // Sortie SYS_03 (3 options)
  activities: Activity[];    // Sortie SYS_04
  budget: BudgetSummary;
  tacticalAdvice: string[];
}

export interface FlightInfo {
  recommendedPeriod: string;
  averagePrice: string;
  airlines: string[];
  tacticalTip: string;
}

export interface HotelOption {
  name: string;
  neighborhood: string;
  pricePerNight: string;
  type: 'value' | 'experience' | 'practical';
  strengths: string[];
}

export interface Activity {
  name: string;
  description: string;
  duration: string;
  estimatedCost: string;
  vibeMatch: string[];
}

export interface BudgetSummary {
  flights: string;
  accommodation: string;
  activities: string;
  total: string;
}
```

---

## 🤖 AI Assistance Strategy

### Which AI Tool for What

| Task | Best Tool | Example |
|------|-----------|---------|
| Architecture questions | Claude Chat / Gemini | "Comment structurer mes agents?" |
| Writing components | Cursor | "Create a chat component..." |
| Debugging errors | Cursor / ChatGPT | "Error: [error]. Fix it" |
| Styling | Cursor + v0.dev | "Style this like Airbnb" |
| Deployment | Cursor | "Deploy to Vercel" |

### Prompt Templates

**Pour créer un nouvel agent:**
```
Create a new agent module for Agent Voyage.

Agent: SYS_0X_[NAME]
Role: [Description from agents/ folder]
Input: UserProfile object
Output: [Specific output format]

Requirements:
- Use Gemini API via lib/gemini.ts
- [With/Without] Google Search Grounding
- Return structured data matching types/index.ts
- Handle errors gracefully with French error messages
- Follow the system prompt from agents/SYS_0X_[NAME].md
```

**Pour débugger:**
```
Error in Agent Voyage:
[Paste exact error]

Context:
- Building feature: [which feature]
- File: [filename]
- Expected: [what should happen]

Stack: Next.js 14, Gemini API, TypeScript, Tailwind

Fix and explain what was wrong.
```

---

## 🚀 Deployment Plan

### Recommended Platform: Vercel (Gratuit)

**Why Vercel:**
- Déploiement automatique à chaque push GitHub
- Free tier généreux (100GB bandwidth)
- Variables d'environnement sécurisées
- Preview URLs pour chaque PR
- Zero configuration pour Next.js

### Deployment Steps:

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - Agent Voyage MVP"
git remote add origin https://github.com/[your-username]/agent-voyage.git
git push -u origin main
```

2. **Connect Vercel:**
   - Aller sur [vercel.com](https://vercel.com)
   - "Import Project" → Sélectionner votre repo GitHub
   - Vercel détecte automatiquement Next.js

3. **Configure Environment Variables:**
```
GOOGLE_API_KEY=AIza...
```

4. **Deploy:**
   - Cliquer "Deploy"
   - Attendre 2-3 minutes
   - Votre app est live sur `agent-voyage.vercel.app`

### Custom Domain (Optionnel - Plus tard):
- Acheter un domaine (~$12/an sur Namecheap)
- Ajouter dans Vercel Settings → Domains

---

## 💰 Cost Breakdown

### Development Phase

| Service | Free Tier | You Need | Notes |
|---------|-----------|----------|-------|
| **Cursor** | 14 jours | Gratuit puis $20/mo | Peut utiliser VS Code gratuit |
| **Gemini API** | 60 req/min, 1500/jour | **$0** | Free tier très généreux |
| **Vercel** | 100GB/mo | Gratuit | Largement suffisant |
| **GitHub** | Illimité | Gratuit | Repos publics/privés |
| **Total Dev** | | **$0** | |

### Production Phase (After Launch)

| Users/mois | Gemini API | Vercel | Total |
|------------|------------|--------|-------|
| 0-500 | **$0** (free tier) | $0 | **$0** |
| 500-1000 | ~$5-10 | $0 | ~$5-10/mo |
| 1000+ | ~$20 | $0-20 | ~$20-40/mo |

**Avantage Gemini Free Tier:**
- 60 requêtes/minute
- 1 500 requêtes/jour
- 1 million de tokens de contexte
- Google Search Grounding inclus
- **Parfait pour un MVP et même au-delà**

---

## 📈 Scaling Path

### Phase 1: MVP (0-500 users)
- Free tier Gemini suffit amplement
- Monitorer les erreurs via Vercel logs
- Collecter feedback utilisateurs

### Phase 2: Traction (500-2000 users)
- Passer au plan Pay-as-you-go Gemini si besoin
- Ajouter Sentry pour error tracking ($0-26/mo)
- Optimiser les prompts pour réduire tokens

### Phase 3: Growth (2000+ users)
- Ajouter une base de données (Supabase gratuit)
- Historique des conversations
- Comptes utilisateurs
- Caching des recherches fréquentes

---

## ⚠️ Important Limitations

### What This Approach CAN'T Do:

1. **Persistance des conversations**
   - *Limitation:* Les conversations sont perdues à la fermeture
   - *Workaround MVP:* Export PDF du rapport final
   - *Solution future:* Ajouter Supabase pour stockage

2. **Prix en temps réel garantis**
   - *Limitation:* Google Search donne des estimations récentes, pas des prix live
   - *Workaround:* Toujours préciser "prix indicatifs" + liens vers Skyscanner

3. **Réservation intégrée**
   - *Limitation:* Pas de booking dans le MVP
   - *Workaround:* Fournir les liens vers Booking/Skyscanner
   - *Solution future:* Affiliate links ou partenariats API

### When You'll Need to Upgrade:
- **1500+ req/jour:** Passer au plan payant Gemini
- **Besoin de comptes:** Ajouter Supabase Auth
- **Historique requis:** Ajouter base de données

---

## 📚 Learning Resources

### Si Vous Êtes Bloqué

**Ressources Next.js:**
- Documentation officielle: [nextjs.org/docs](https://nextjs.org/docs)
- YouTube: "Next.js 14 Crash Course" (Traversy Media)

**Gemini API:**
- Documentation: [ai.google.dev/docs](https://ai.google.dev/docs)
- Google AI Studio: [aistudio.google.com](https://aistudio.google.com)
- Exemples: [github.com/google/generative-ai-js](https://github.com/google/generative-ai-js)

**Communautés d'aide:**
- Discord Next.js: [discord.gg/nextjs](https://discord.gg/nextjs)
- Stack Overflow: tag `next.js` ou `gemini-api`
- Reddit: r/GoogleGeminiAI

### Quand Demander à l'IA vs Chercher

| Situation | Action |
|-----------|--------|
| Erreur avec message clair | Coller dans Cursor → "Fix this" |
| Concept que vous ne comprenez pas | Demander à Gemini/Claude d'expliquer |
| Bug bizarre sans message | Chercher sur Stack Overflow d'abord |
| "Comment faire X" | Demander à Cursor avec contexte |

---

## ✅ Success Checklist

### Before Starting (Day 1)
- [ ] Compte Google AI Studio créé + clé API obtenue
- [ ] Compte Vercel créé
- [ ] Compte GitHub créé
- [ ] Cursor installé et configuré
- [ ] Projet Next.js initialisé

### During Development (Days 2-10)

**Semaine 1:**
- [ ] Page d'accueil avec design voyage
- [ ] Interface chat fonctionnelle
- [ ] API route `/api/chat` connectée à Gemini
- [ ] Profilage 5 questions opérationnel
- [ ] Premier déploiement Vercel

**Semaine 2:**
- [ ] Agent Culture (SYS_01) implémenté
- [ ] Agent Vols (SYS_02) avec Google Search
- [ ] Agent Hôtels (SYS_03) avec Google Search
- [ ] Agent Activités (SYS_04) implémenté
- [ ] Rapport final affiché proprement
- [ ] Follow-up avec triage basique
- [ ] Tests mobile

### Before Launch
- [ ] Testé parcours complet 10+ fois
- [ ] Testé sur mobile (iPhone + Android)
- [ ] Messages d'erreur clairs en français
- [ ] 5 personnes ont testé et donné feedback
- [ ] Domaine custom configuré (optionnel)

---

## 🎯 Definition of Technical Success

Votre implémentation technique est réussie quand:

- [ ] L'app ne crash pas pendant une session complète
- [ ] Un itinéraire est généré en moins de 60 secondes
- [ ] Les prix affichés viennent de Google Search (pas inventés)
- [ ] L'interface est utilisable sur mobile
- [ ] Vous pouvez déployer une mise à jour en 5 minutes
- [ ] Les coûts mensuels restent à **$0** (free tier)
- [ ] Vous comprenez comment ajouter un 6ème agent si besoin

---

## 📝 Implementation Order (Step by Step)

### Jour 1: Setup
```
1. Créer projet Next.js
2. Installer dépendances (Google Generative AI SDK, shadcn)
3. Configurer .env.local avec clé API Gemini
4. Premier déploiement Vercel "Hello World"
```

### Jours 2-3: Chat Interface
```
1. Créer composant ChatInterface
2. Créer API route /api/chat
3. Connecter frontend → backend → Gemini
4. Tester conversation basique
```

### Jours 4-5: Profilage
```
1. Implémenter logique orchestrator
2. Extraction des réponses utilisateur
3. Flux de 5 questions
4. Confirmation du profil
```

### Jours 6-8: Agents
```
1. SYS_01 Culture (le plus simple)
2. SYS_02 Vols (avec Google Search)
3. SYS_03 Hôtels (avec Google Search)
4. SYS_04 Activités
5. Compilation rapport final
```

### Jours 9-10: Polish
```
1. Design et couleurs finaux
2. Responsive mobile
3. Messages d'erreur
4. Tests utilisateurs
5. Corrections finales
```

---

*Technical Design for: Agent Voyage*
*Approach: Next.js + Gemini API + Vercel (AI writes all code)*
*Estimated Time to MVP: 1-2 weeks*
*Estimated Cost: **$0/month** (Gemini free tier)*
