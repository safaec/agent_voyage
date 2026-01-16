# Project Brief - Agent Voyage

## Product Vision
Assistant de voyage IA qui crée des itinéraires personnalisés complets (vols, hôtels, activités) en 5 questions, grâce à un système multi-agent.

## Target User
**Le Voyageur Curieux** - Personne qui veut planifier un voyage sans passer des heures à comparer sur 10+ sites différents.

## Core Value Proposition
- Planification en 5 questions au lieu de 10-20 heures
- Prix réels via recherche web (pas d'invention)
- Itinéraire adapté au "vibe" du voyageur
- Contexte culturel pour mieux apprécier la destination

## Technical Decisions

### Why Next.js + Gemini?
1. **Next.js:** Framework le mieux documenté, déploiement Vercel gratuit
2. **Gemini:** Free tier généreux (1500 req/jour), Google Search intégré, 1M tokens context
3. **No separate backend:** API Routes suffisent pour le MVP

### Why Multi-Agent?
Chaque agent est spécialisé:
- **SYS_00 Orchestrator:** Coordination, pas d'expertise spécifique
- **SYS_01 Culture:** Connaissance géopolitique et culturelle
- **SYS_02 Vols:** Yield management, compagnies, tarifs
- **SYS_03 Hôtels:** Quartiers, rapport qualité-prix
- **SYS_04 Activités:** Planning optimisé géographiquement

## Quality Gates

### Before Each Commit
- Code compile sans erreur (`npm run build`)
- App fonctionne en local (`npm run dev`)
- Feature testée manuellement

### Before Each Phase Completion
- Toutes les features de la phase fonctionnent
- Testé sur mobile (Chrome DevTools)
- Messages d'erreur clairs en français

### Before Launch
- Parcours complet testé 10+ fois
- 5 personnes ont testé et donné feedback
- Deployed on Vercel et accessible

## Coding Conventions

### Language
- Code: English (variable names, comments)
- UI: French (all user-facing text)
- Docs: French

### Commits
```
feat: add chat interface component
fix: correct message bubble alignment
refactor: extract gemini client to lib/
```

### Error Messages (User-Facing)
```
"Désolé, je n'ai pas pu trouver les prix des vols. Consultez Skyscanner directement."
"Une erreur est survenue. Veuillez réessayer."
"Veuillez d'abord me dire votre destination."
```

## Key Commands

```bash
# Development
npm run dev          # Start localhost:3000
npm run build        # Build for production
npm run lint         # Check code style
npm run start        # Run production build locally

# Deployment
git push origin main # Auto-deploys to Vercel
```

## Environment Variables

| Variable | Description | Where to get |
|----------|-------------|--------------|
| `GOOGLE_API_KEY` | Gemini API key | [aistudio.google.com](https://aistudio.google.com) |

## Budget Constraints
- **Monthly cost target:** $0 (free tier only)
- **No paid APIs** unless free tier exceeded
- **No paid UI libraries** (shadcn/ui is free)

## Timeline
- **Target:** 1-2 weeks to MVP
- **Approach:** Vibe-coding (AI writes code, human guides and tests)

## Update Cadence
- Update `AGENTS.md` "Current State" after each work session
- Update this brief if technical decisions change
- Update `testing.md` if new test patterns emerge

## Out of Scope for MVP
- User accounts / authentication
- Saved itineraries (no database)
- Booking integration
- Multi-language (French only)
- PDF export (nice-to-have)
