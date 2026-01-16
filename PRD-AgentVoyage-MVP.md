# Product Requirements Document: Agent Voyage MVP

## 🎯 Product Overview

**App Name:** Agent Voyage
**Tagline:** Votre assistant de voyage intelligent propulsé par l'IA - Des itinéraires personnalisés en quelques minutes
**Launch Goal:** Portfolio fonctionnel démontrant les capacités du système multi-agent
**Target Launch:** 6-8 semaines

## 👥 Who It's For

### Primary User: Le Voyageur Curieux

Personne souhaitant planifier un voyage mais submergée par la quantité d'informations disponibles en ligne. Elle veut des recommandations personnalisées sans passer des heures sur différents sites de comparaison.

**Their Current Pain:**
- Passer des heures à comparer les vols sur plusieurs sites
- Difficulté à trouver des hôtels qui correspondent vraiment à leur style
- Ne pas savoir quelles activités correspondent à leur "vibe" de voyage
- Manque de contexte culturel et géopolitique sur les destinations
- Informations dispersées nécessitant de jongler entre 10+ onglets

**What They Need:**
- Un assistant qui comprend leur style de voyage (détente, aventure, culture, gastronomie)
- Des recommandations de vols avec les meilleures périodes tarifaires
- Des suggestions d'hôtels diversifiées (meilleur rapport qualité-prix, expérience unique, pratique)
- Un itinéraire d'activités cohérent et géographiquement optimisé
- Un contexte culturel pour mieux apprécier leur destination

### Example User Story

"Meet Sophie, une jeune professionnelle de 32 ans qui rêve de découvrir Tokyo. Chaque soir après le travail, elle passe 2 heures à comparer les prix de vols, lire des avis d'hôtels contradictoires, et sauvegarder des dizaines d'activités sur Pinterest sans savoir lesquelles choisir. Elle a besoin d'un assistant qui comprend qu'elle veut un voyage équilibré entre culture et gastronomie, avec un budget modéré, pour qu'elle puisse réserver en confiance et profiter de l'anticipation de son voyage au lieu de stresser sur la logistique."

## 🔧 The Problem We're Solving

La planification de voyage est fragmentée et chronophage. Les voyageurs doivent naviguer entre Skyscanner, Booking, TripAdvisor, blogs de voyage, et forums pour assembler manuellement leur itinéraire. Ce processus prend en moyenne 10-20 heures pour un voyage d'une semaine.

Agent Voyage centralise cette expertise grâce à 5 agents IA spécialisés qui travaillent ensemble pour créer un itinéraire complet et personnalisé en quelques minutes.

**Why Existing Solutions Fall Short:**
- **Google Travel / TripAdvisor:** Agrègent des données mais ne personnalisent pas selon le "vibe" du voyageur
- **Agences en ligne (Expedia, Kayak):** Focalisées sur la transaction, pas sur la curation d'expérience
- **Travel bloggers:** Contenu générique, pas adapté aux dates/budget spécifiques
- **ChatGPT vanilla:** Pas d'accès aux prix réels, peut halluciner des informations

## 🎬 User Journey

### Discovery → First Use → Success

1. **Discovery Phase**
   - How they find us: Portfolio personnel, bouche-à-oreille, réseaux sociaux
   - What catches their attention: "Planifiez votre voyage en 5 questions"
   - Decision trigger: Curiosité de voir ce que l'IA peut proposer

2. **Onboarding (First 5 Minutes)**
   - Land on: Page d'accueil avec interface de chat épurée
   - First action: Répondre à 5 questions de profilage (destination, dates, budget, configuration, vibe)
   - Quick win: Recevoir instantanément le contexte culturel de la destination

3. **Core Usage Loop**
   - Trigger: Envie de planifier un nouveau voyage ou modifier l'itinéraire
   - Action: Interagir avec l'assistant via chat naturel
   - Reward: Itinéraire complet avec vols, hôtels, activités et budget
   - Investment: Personnalisation accumulée au fil des échanges

4. **Success Moment**
   - "Aha!" moment: Quand l'itinéraire proposé correspond parfaitement à leur style
   - Share trigger: Qualité du rapport final exportable/partageable

## ✨ MVP Features

### 🔴 Must Have for Launch

#### 1. Interface de Chat Conversationnelle
- **What:** Interface web permettant de dialoguer avec l'assistant voyage
- **User Story:** As a voyageur, I want to décrire mon voyage en langage naturel so that je n'ai pas à remplir des formulaires complexes
- **Success Criteria:**
  - [ ] L'utilisateur peut envoyer des messages texte
  - [ ] Les réponses de l'assistant s'affichent de manière fluide
  - [ ] L'historique de conversation est visible
- **Priority:** P0 (Critical)

#### 2. Système de Profilage en 5 Questions
- **What:** Collecte structurée des informations essentielles (destination, dates, budget, voyageurs, vibe)
- **User Story:** As a voyageur, I want to répondre à quelques questions clés so that l'assistant comprenne exactement ce que je recherche
- **Success Criteria:**
  - [ ] Les 5 questions sont posées de manière conversationnelle
  - [ ] L'utilisateur peut répondre en une ou plusieurs fois
  - [ ] Le profil est confirmé avant génération de l'itinéraire
- **Priority:** P0 (Critical)

#### 3. Génération d'Itinéraire Complet
- **What:** Rapport structuré incluant contexte culturel, vols, hôtels (3 options), et activités
- **User Story:** As a voyageur, I want to recevoir un itinéraire complet so that j'ai toutes les informations pour planifier mon voyage
- **Success Criteria:**
  - [ ] Paragraphe culturel et géopolitique (150-200 mots)
  - [ ] Recommandations de vols avec prix estimés et meilleures périodes
  - [ ] 3 options d'hôtels diversifiées (value, expérience, pratique)
  - [ ] 4-8 activités adaptées à la durée et au vibe
  - [ ] Budget estimatif global
- **Priority:** P0 (Critical)

#### 4. Recherche Web en Temps Réel (Vols & Hôtels)
- **What:** Les agents SYS_02 et SYS_03 utilisent la recherche web pour des prix actualisés
- **User Story:** As a voyageur, I want to avoir des prix réels et actuels so that je puisse faire confiance aux estimations budgétaires
- **Success Criteria:**
  - [ ] Les prix des vols sont recherchés en ligne (minimum 2 recherches)
  - [ ] Les prix des hôtels sont vérifiés sur Booking/Hotels.com
  - [ ] "Prix non disponible" affiché si recherche échoue (pas d'invention)
- **Priority:** P0 (Critical)

#### 5. Gestion des Modifications (Follow-up)
- **What:** Système de triage permettant d'ajuster l'itinéraire après génération
- **User Story:** As a voyageur, I want to pouvoir demander des ajustements so that l'itinéraire corresponde parfaitement à mes besoins
- **Success Criteria:**
  - [ ] Questions de clarification traitées directement
  - [ ] Ajustements mineurs (ex: changer un hôtel) sans tout régénérer
  - [ ] Changements majeurs (destination/durée) relancent le profilage
- **Priority:** P0 (Critical)

### 🟡 Nice to Have (If Time Allows)
- **Export PDF:** Télécharger l'itinéraire en format imprimable
- **Historique des voyages:** Sauvegarder les itinéraires générés
- **Mode sombre:** Interface adaptée aux préférences visuelles

### 🚫 NOT in MVP (Saving for Later)
- **Réservation intégrée:** Will add after validation du concept - complexité juridique et partenariats requis
- **Compte utilisateur:** Will add after avoir des utilisateurs récurrents - overkill pour un portfolio
- **Multi-langue:** Will add after le marché francophone validé
- **Comparateur de prix en direct:** Will add after partenariats API établis

*Why we're waiting: Keeps MVP focused and launchable in 6-8 weeks*

## 📊 How We'll Know It's Working

### Launch Success Metrics (First 30 Days)
| Metric | Target | Measure |
|--------|--------|---------|
| Itinéraires générés | 50+ | Compteur dans l'app |
| Taux de complétion du profilage | >80% | Users qui finissent les 5 questions |
| Feedback positif | >4/5 étoiles | Sondage simple en fin de session |

### Growth Metrics (Months 2-3)
| Metric | Target | Measure |
|--------|--------|---------|
| Visiteurs uniques | 200+ | Analytics |
| Partages/Recommandations | 20+ | Tracking des partages |

## 🎨 Look & Feel

**Design Vibe:** Chaleureux, inspirant, voyage

**Visual Principles:**
1. **Évocateur:** Couleurs et visuels qui inspirent l'évasion (tons chauds, images de destinations)
2. **Accessible:** Interface claire même pour les non-technophiles
3. **Confiant:** Design professionnel qui inspire la confiance dans les recommandations

**Key Screens/Pages:**
1. **Page d'accueil:** Hero inspirant + CTA "Planifier mon voyage"
2. **Interface Chat:** Zone de conversation + affichage structuré des résultats
3. **Rapport Final:** Itinéraire complet avec sections clairement délimitées

### Simple Wireframe

```
[Page d'Accueil]
┌─────────────────────────────────┐
│         [Logo Agent Voyage]      │
├─────────────────────────────────┤
│                                 │
│   🌍 Planifiez votre voyage     │
│   en 5 questions                │
│                                 │
│   [Image inspirante voyage]     │
│                                 │
├─────────────────────────────────┤
│    [Commencer l'aventure →]     │
└─────────────────────────────────┘

[Interface Chat]
┌─────────────────────────────────┐
│ Agent Voyage           [Menu]   │
├─────────────────────────────────┤
│ 🤖: Bonjour ! Où rêvez-vous    │
│     d'aller ?                   │
│                                 │
│              Tokyo 🗼  :👤      │
│                                 │
│ 🤖: Excellent choix ! Quand    │
│     souhaitez-vous partir ?     │
│                                 │
├─────────────────────────────────┤
│ [Tapez votre message...]   [→]  │
└─────────────────────────────────┘

[Rapport Final]
┌─────────────────────────────────┐
│ 📋 Votre Itinéraire Tokyo      │
├─────────────────────────────────┤
│ 🌸 Contexte Culturel           │
│ [Paragraphe 150-200 mots]      │
├─────────────────────────────────┤
│ ✈️ Vols Recommandés            │
│ Période | Prix | Compagnies    │
├─────────────────────────────────┤
│ 🏨 Hébergements (3 options)    │
│ [Tableau comparatif]           │
├─────────────────────────────────┤
│ 🎯 Activités & Planning        │
│ [Liste avec durées et prix]    │
├─────────────────────────────────┤
│ 💰 Budget Estimé: XXXX€        │
└─────────────────────────────────┘
```

## ⚡ Technical Considerations

**Platform:** Web (responsive)
**Responsive:** Oui, mobile-first
**Performance:** Page load < 3 secondes, réponses IA < 30 secondes
**Accessibility:** WCAG 2.1 AA minimum
**Security/Privacy:** Pas de données personnelles stockées pour le MVP (conversations non persistées)
**Scalability:** Design stateless permettant scaling horizontal si besoin

### Architecture Multi-Agent

Le système repose sur 5 agents spécialisés orchestrés par Claude Projects :

| Agent | Rôle | Web Search |
|-------|------|------------|
| **SYS_00 - Orchestrator** | Coordination, profilage, compilation | Non |
| **SYS_01 - Culture** | Contexte culturel et géopolitique | Non |
| **SYS_02 - Vols** | Recherche vols et yield management | **Oui** |
| **SYS_03 - Hôtels** | Recommandations hébergement | **Oui** |
| **SYS_04 - Activités** | Planification itinéraire | Non |

**Flux d'exécution:**
```
Utilisateur → Profilage (5 questions) →
Culture → Vols → Hôtels → Activités →
Rapport Final → Follow-up (si besoin)
```

## 🛡️ Quality Standards

**What This App Will NOT Accept:**
- Placeholder content in production ("Lorem ipsum", sample images)
- Prix inventés - toujours indiquer "Prix non disponible" si recherche échoue
- Broken features—everything listed works or isn't included
- Skipping mobile testing before launch
- Ignoring accessibility basics
- Jargon technique visible par l'utilisateur ("Activation de SYS_02...")

*Ces standards seront appliqués par l'assistant IA de développement.*

## 💰 Budget & Constraints

**Development Budget:** Minimal - utilisation d'outils gratuits/freemium
**Monthly Operating:**
- Hébergement: $0 (Vercel/Netlify free tier)
- API Claude: Variable selon usage (crédits gratuits initiaux)
- Domaine (optionnel): ~$12/an

**Timeline:** 6-8 semaines to launch
**Team:** Solo (vibe-coder assisté par IA)

## ❓ Open Questions & Assumptions

**Open Questions:**
- Quel framework frontend utiliser ? (Next.js vs Nuxt vs autre)
- Comment exposer les agents Claude en API ? (Claude Projects API vs implémentation custom)
- Faut-il un backend ou tout peut être client-side + API Claude ?

**Assumptions:**
- Les utilisateurs accepteront de répondre à 5 questions avant d'avoir des résultats
- La recherche web de Claude est suffisamment fiable pour les prix vols/hôtels
- Le format de rapport en sections est plus utile qu'un planning jour par jour

## 🚀 Launch Strategy (Brief)

**Soft Launch:** Partage avec cercle proche (amis, famille, communauté dev)
**Target Users:** 20-50 beta testeurs
**Feedback Plan:** Formulaire simple en fin de session + entretiens qualitatifs
**Iteration Cycle:** Hebdomadaire pendant les 4 premières semaines

## ✅ Definition of Done for MVP

The MVP is ready to launch when:
- [ ] Interface chat fonctionnelle et responsive
- [ ] Profilage en 5 questions opérationnel
- [ ] Les 5 agents génèrent leurs sections respectives
- [ ] Recherche web active pour vols et hôtels
- [ ] Rapport final affiché de manière structurée
- [ ] Follow-up avec triage (clarification/ajustement/refonte)
- [ ] Basic error handling works (messages d'erreur clairs)
- [ ] It works on mobile and desktop
- [ ] One complete user journey works end-to-end
- [ ] Friends/family test is complete
- [ ] Deployment is automated

## 📝 Next Steps

After this PRD is approved:
1. Create Technical Design Document (Part III)
2. Set up development environment
3. Build MVP with AI assistance
4. Test with 5-10 beta users
5. Launch! 🎉

---
*Document created: 16 janvier 2026*
*Status: Draft - Ready for Technical Design*
