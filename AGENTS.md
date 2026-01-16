# AGENTS.md - Master Plan for Agent Voyage

## Project Overview
**App:** Agent Voyage
**Goal:** Assistant de voyage IA qui crée des itinéraires personnalisés en 5 questions
**Stack:** Next.js 14 + Gemini API + Tailwind CSS + Vercel
**Current Phase:** Phase 5 - Rapport Final

## How I Should Think
1. **Understand Intent First**: Avant de répondre, identifier ce que l'utilisateur veut vraiment
2. **Ask If Unsure**: Si une information critique manque, demander avant de coder
3. **Plan Before Coding**: Proposer un plan, attendre validation, puis implémenter
4. **Verify After Changes**: Tester après chaque modification
5. **Explain Trade-offs**: Quand je recommande quelque chose, mentionner les alternatives

## Plan > Execute > Verify
1. **Plan:** Outline brief approach, ask for approval
2. **Execute:** Implement one feature at a time
3. **Verify:** Run `npm run dev` and test manually after each feature

## Context Files
Refer to these for details (load only when needed):
- `agent_docs/tech_stack.md`: Stack technique & librairies
- `agent_docs/code_patterns.md`: Patterns de code & conventions
- `agent_docs/project_brief.md`: Règles projet persistantes
- `agent_docs/product_requirements.md`: PRD complet
- `agent_docs/testing.md`: Stratégie de vérification

## Current State (Update This!)
**Last Updated:** 16 janvier 2026
**Working On:** Phase 5 - Rapport Final
**Recently Completed:** Phase 4 - Agents Spécialisés (culture.ts, flights.ts, hotels.ts, activities.ts, API /api/generate)
**Blocked By:** None

## Roadmap

### Phase 1: Foundation (Semaine 1) ✅
- [x] Initialiser projet Next.js avec TypeScript + Tailwind
- [x] Configurer .env.local avec clé API Gemini
- [x] Créer page d'accueil avec design voyage
- [ ] Premier déploiement Vercel "Hello World"
- [x] Installer shadcn/ui pour les composants

### Phase 2: Chat Interface (Semaine 1) ✅
- [x] Créer composant ChatInterface.tsx
- [x] Créer composant MessageBubble.tsx
- [x] Créer API route /api/chat
- [x] Connecter frontend → backend → Gemini
- [x] Tester conversation basique

### Phase 3: Profilage 5 Questions (Semaine 1-2) ✅
- [x] Implémenter logique orchestrator (SYS_00)
- [x] Extraction des réponses utilisateur via Gemini
- [x] Flux conversationnel des 5 questions
- [x] Confirmation du profil avant génération

### Phase 4: Agents Spécialisés (Semaine 2) ✅
- [x] SYS_01 Culture - Contexte culturel destination
- [x] SYS_02 Vols - Avec Google Search Grounding
- [x] SYS_03 Hôtels - Avec Google Search Grounding
- [x] SYS_04 Activités - Planning adapté au vibe

### Phase 5: Rapport Final (Semaine 2)
- [ ] Composant ItineraryReport.tsx
- [ ] Compilation des sorties des 4 agents
- [ ] Affichage structuré avec sections
- [ ] Budget estimatif global

### Phase 6: Follow-up & Polish (Semaine 2)
- [ ] Système de triage (clarification/ajustement/refonte)
- [ ] Design responsive mobile
- [ ] Messages d'erreur en français
- [ ] Tests utilisateurs (5 personnes minimum)

## Architecture Multi-Agent

```
Utilisateur
    │
    ▼
┌─────────────────────────────────────┐
│  SYS_00 - ORCHESTRATOR              │
│  - Profilage (5 questions)          │
│  - Coordination des agents          │
│  - Compilation rapport final        │
│  - Triage des follow-ups            │
└─────────────────────────────────────┘
    │
    ├──▶ SYS_01 Culture (sans web search)
    │         └── Contexte culturel 150-200 mots
    │
    ├──▶ SYS_02 Vols (AVEC Google Search)
    │         └── Prix, périodes, compagnies
    │
    ├──▶ SYS_03 Hôtels (AVEC Google Search)
    │         └── 3 options diversifiées
    │
    └──▶ SYS_04 Activités (sans web search)
              └── 4-8 activités + restaurants
```

## What NOT To Do
- Do NOT delete files without explicit confirmation
- Do NOT add features not in the current phase
- Do NOT invent prices - always indicate "Prix non disponible" if search fails
- Do NOT skip mobile testing
- Do NOT show technical jargon to users ("Activation de SYS_02...")
- Do NOT use Lorem ipsum or placeholder content
- Do NOT bypass errors - fix them immediately

## Key Commands
```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Build for production
npm run lint     # Check code style
```

## File Structure Target
```
agent-voyage/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Page d'accueil
│   │   ├── chat/
│   │   │   └── page.tsx          # Interface chat
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts      # API endpoint
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── ItineraryReport.tsx
│   │   └── LoadingIndicator.tsx
│   │
│   ├── lib/
│   │   ├── agents/
│   │   │   ├── orchestrator.ts   # SYS_00
│   │   │   ├── culture.ts        # SYS_01
│   │   │   ├── flights.ts        # SYS_02
│   │   │   ├── hotels.ts         # SYS_03
│   │   │   └── activities.ts     # SYS_04
│   │   │
│   │   ├── prompts/
│   │   │   └── system-prompts.ts
│   │   │
│   │   └── gemini.ts             # Client Gemini API
│   │
│   └── types/
│       └── index.ts
│
├── .env.local                    # GOOGLE_API_KEY (NE PAS COMMIT)
├── AGENTS.md
├── CLAUDE.md
└── agent_docs/
```

## Success Metrics (MVP)
- [ ] 50+ itinéraires générés
- [ ] >80% taux de complétion du profilage
- [ ] >4/5 étoiles feedback utilisateur
- [ ] $0/mois de coûts (free tier)
