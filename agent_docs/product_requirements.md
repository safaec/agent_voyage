# Product Requirements - Agent Voyage

## Overview
**App:** Agent Voyage
**Tagline:** Votre assistant de voyage intelligent propulsé par l'IA - Des itinéraires personnalisés en quelques minutes
**Target Launch:** 6-8 semaines

## User Story Principal
"En tant que voyageur curieux, je veux décrire mon voyage en langage naturel et recevoir un itinéraire complet (vols, hôtels, activités) adapté à mon style, pour ne plus passer des heures à comparer sur différents sites."

## Must Have Features (P0)

### 1. Interface de Chat Conversationnelle
- Dialogue en langage naturel
- Messages user à droite, assistant à gauche
- Historique de conversation visible
- Indicateur de chargement pendant les réponses

### 2. Système de Profilage (5 Questions)
Questions à collecter de manière conversationnelle:
1. **Destination:** Où souhaitez-vous partir ?
2. **Dates:** Quand souhaitez-vous voyager ?
3. **Budget:** Quel est votre budget ? (économique/modéré/confortable/luxe)
4. **Voyageurs:** Qui voyage avec vous ? (solo/couple/famille/amis)
5. **Vibe:** Quel type de voyage ? (détente/culture/aventure/gastronomie)

### 3. Génération d'Itinéraire Complet
Le rapport doit inclure:
- **Contexte culturel:** Paragraphe 150-200 mots (SYS_01)
- **Vols:** Période recommandée, prix estimés, compagnies (SYS_02)
- **Hôtels:** 3 options diversifiées - value/expérience/pratique (SYS_03)
- **Activités:** 4-8 activités adaptées au vibe et durée (SYS_04)
- **Budget estimatif global**

### 4. Recherche Web en Temps Réel
- Prix des vols recherchés en ligne (Google Search Grounding)
- Prix des hôtels vérifiés sur sources actuelles
- RÈGLE: "Prix non disponible" si recherche échoue (jamais d'invention)

### 5. Gestion des Follow-ups (Triage)
- **Clarification:** Questions simples → Réponse directe
- **Ajustement mineur:** Changer un hôtel → Réactiver 1 agent
- **Changement majeur:** Nouvelle destination → Restart profilage

## Nice to Have (If Time)
- Export PDF de l'itinéraire
- Historique des voyages planifiés
- Mode sombre

## NOT in MVP
- Réservation intégrée (complexité juridique)
- Comptes utilisateur (overkill pour portfolio)
- Multi-langue (français uniquement)
- Comparateur de prix en direct (nécessite partenariats API)

## Success Metrics

### Launch (30 premiers jours)
| Metric | Target |
|--------|--------|
| Itinéraires générés | 50+ |
| Taux complétion profilage | >80% |
| Feedback utilisateur | >4/5 |

### Growth (Mois 2-3)
| Metric | Target |
|--------|--------|
| Visiteurs uniques | 200+ |
| Partages/Recommandations | 20+ |

## Design Requirements

### Vibe
Chaleureux, inspirant, voyage

### Couleurs
- Primary: #E07A5F (Terracotta)
- Secondary: #3D405B (Bleu nuit)
- Accent: #81B29A (Vert sauge)
- Background: #FDF6EC (Crème chaud)

### Typographie
- Headings: Playfair Display (serif, élégant)
- Body: Inter (sans-serif, lisible)

### Écrans Principaux
1. **Page d'accueil:** Hero inspirant + CTA "Planifier mon voyage"
2. **Interface Chat:** Zone conversation + résultats structurés
3. **Rapport Final:** Sections clairement délimitées

## Technical Requirements

### Performance
- Page load: < 3 secondes
- Réponses IA: < 30 secondes

### Responsive
- Mobile-first design
- Fonctionne sur iPhone, Android, Desktop

### Accessibility
- WCAG 2.1 AA minimum
- Contraste suffisant
- Navigation clavier

### Security
- Pas de données personnelles stockées
- Clé API non exposée côté client

## Quality Standards (Non-Négociables)
- Pas de Lorem ipsum ou placeholder
- Pas de prix inventés
- Pas de features cassées
- Pas de jargon technique visible ("SYS_02 activé...")
- Messages d'erreur clairs en français

## Definition of Done
MVP prêt quand:
- [ ] Interface chat fonctionnelle et responsive
- [ ] Profilage 5 questions opérationnel
- [ ] Les 5 agents génèrent leurs sections
- [ ] Recherche web active pour vols/hôtels
- [ ] Rapport final affiché proprement
- [ ] Follow-up avec triage fonctionne
- [ ] Error handling basique (messages clairs)
- [ ] Fonctionne sur mobile et desktop
- [ ] Un parcours complet end-to-end fonctionne
- [ ] 5 personnes ont testé
- [ ] Déployé sur Vercel
