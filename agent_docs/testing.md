# Testing Strategy - Agent Voyage

## Approach: Manual Testing First
Pour un MVP vibe-coded, on privilégie les tests manuels rapides plutôt que des suites de tests automatisés complexes.

## Verification Loop
Après CHAQUE modification:
1. `npm run dev` - Vérifier que ça compile
2. Ouvrir http://localhost:3000
3. Tester la feature modifiée
4. Vérifier sur mobile (Chrome DevTools → Toggle device)

## Test Scenarios par Feature

### 1. Interface Chat
```
[ ] Message envoyé s'affiche à droite
[ ] Réponse assistant s'affiche à gauche
[ ] Indicateur de chargement visible pendant l'attente
[ ] Scroll automatique vers le nouveau message
[ ] Input se vide après envoi
[ ] Bouton désactivé pendant le chargement
```

### 2. Profilage 5 Questions
```
[ ] Question 1 (destination) posée au démarrage
[ ] Réponse utilisateur extraite correctement
[ ] Questions suivantes posées une par une
[ ] Profil complet résumé avant génération
[ ] Possibilité de corriger une réponse
```

Test conversation type:
```
User: "Je veux aller à Tokyo"
Bot: [Extrait destination=Tokyo, pose question dates]
User: "En avril pour 10 jours"
Bot: [Extrait dates, pose question budget]
User: "Budget modéré"
Bot: [Extrait budget, pose question voyageurs]
User: "En couple"
Bot: [Extrait travelers, pose question vibe]
User: "Culture et gastronomie"
Bot: [Résume le profil, demande confirmation]
```

### 3. Génération Itinéraire
```
[ ] Section Culture affichée (150-200 mots)
[ ] Section Vols avec prix (ou "non disponible")
[ ] Section Hôtels avec 3 options
[ ] Section Activités avec 4-8 items
[ ] Budget total estimé
[ ] Temps de génération < 60 secondes
```

### 4. Recherche Web (Vols & Hôtels)
```
[ ] Prix affichés semblent réalistes
[ ] Source mentionnée quand applicable
[ ] "Prix non disponible" si recherche échoue
[ ] Pas de prix inventés (vérifier manuellement sur Skyscanner)
```

### 5. Follow-up / Triage
```
[ ] Question clarification → réponse directe
[ ] "Change l'hôtel" → nouvelle suggestion hôtel seul
[ ] "Finalement je vais à Osaka" → restart profilage
```

### 6. Responsive / Mobile
Tester sur Chrome DevTools avec:
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPad (768px)

```
[ ] Page d'accueil lisible sur mobile
[ ] Chat utilisable (input accessible, messages lisibles)
[ ] Rapport scrollable sans overflow horizontal
[ ] Boutons cliquables (44px minimum)
```

### 7. Error Handling
```
[ ] Pas de crash si API Gemini timeout
[ ] Message d'erreur clair si API key manquante
[ ] Message d'erreur clair si réseau coupé
[ ] Pas d'erreur console JavaScript visible
```

## Pre-Deployment Checklist

### Build Check
```bash
npm run build
# Doit passer sans erreur
```

### Environment Check
```bash
# Vérifier que .env.local existe avec:
GOOGLE_API_KEY=AIza...
```

### Vercel Preview
Avant de merger:
1. Push sur une branche
2. Vérifier la preview URL Vercel
3. Tester un parcours complet sur la preview

## User Testing (5 personnes minimum)

### Script de test
Envoyer aux testeurs:
```
1. Ouvre [URL]
2. Clique "Planifier mon voyage"
3. Réponds aux 5 questions comme si tu planifiais vraiment un voyage
4. Attends l'itinéraire complet
5. Demande un ajustement (ex: "Je préfère un hôtel moins cher")
6. Dis-moi:
   - Est-ce que c'était facile à utiliser ?
   - L'itinéraire te semble utile ?
   - Quelque chose t'a bloqué ou frustré ?
```

### Feedback à collecter
- Note globale /5
- Points positifs
- Points négatifs
- Bugs rencontrés
- Suggestions

## Known Limitations (Ne pas tester)
- Persistance des conversations (non implémenté)
- Export PDF (nice-to-have)
- Comptes utilisateur (hors scope)

## Commandes de Debugging

```bash
# Voir les logs Vercel en production
vercel logs

# Relancer le dev server si problème
npm run dev

# Vérifier les types TypeScript
npx tsc --noEmit

# Clear cache Next.js si comportement bizarre
rm -rf .next && npm run dev
```

## Test Destinations Recommandées
Pour les tests manuels, utiliser des destinations variées:
- **Tokyo** - Destination populaire, beaucoup de données
- **Lisbonne** - Europe, bon pour tester les vols courts
- **Bali** - Asie du Sud-Est, teste les vols longs
- **New York** - Amérique, teste le décalage horaire
- **Marrakech** - Proche, bon pour tester budget économique
