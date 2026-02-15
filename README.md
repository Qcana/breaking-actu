# Briefing Actu

Application mobile React Native (Expo) qui affiche les 5 actualites les plus importantes du jour en France.

## Fonctionnalites

- Affichage des 5 actualites principales via NewsAPI
- Categories automatiques avec icones colorees (Economie, Techno, Sport, etc.)
- Filtrage par categorie et recherche d'articles
- Pull-to-refresh pour actualiser les news
- Affichage du temps relatif ("Il y a 2h", "Il y a 30 min")
- Design epure avec cartes numerotees et effets chrome
- Ecran de resume/briefing avec synthese vocale (TTS)
- Systeme de favoris avec animation
- Historique des briefings passes avec timeline et statistiques
- Mode hors-ligne avec cache automatique et indicateur de stockage
- Banniere offline/sync avec barre de progression
- Notifications push quotidiennes configurables (heure au choix dans les Reglages)
- Ecran d'onboarding au premier lancement
- Retour haptique sur toutes les interactions
- Animations d'entree en cascade sur les cartes
- Theme sombre/clair commutable
- Selection des sources d'actualites

## Pre-requis

- **Node.js** (v18 ou superieur)
- **Expo CLI** : installe automatiquement via npx
- **Un compte NewsAPI** : cree un compte gratuit sur [newsapi.org](https://newsapi.org) pour obtenir une cle API
- **Expo Go** (app mobile) : installe sur ton telephone depuis l'App Store ou Google Play

## Installation

1. Ouvre un terminal et va dans le dossier du projet :
   ```
   cd C:\Users\Code\Documents\briefing-actu
   ```

2. Installe les dependances :
   ```
   npm install
   ```

3. **Configure ta cle API** : ouvre `src/constants.js` et remplace la valeur de `API_KEY` par ta cle NewsAPI.

## Lancement

```
npx expo start
```

Puis :
- **Sur telephone** : scanne le QR code avec l'app Expo Go
- **Sur navigateur** : appuie sur `w` dans le terminal
- **Sur Android** : appuie sur `a` (necessite un emulateur)

## Structure du projet

```
briefing-actu/
  App.js                  # Point d'entree, navigation principale (tabs + stacks)
  index.js                # Enregistrement de l'app Expo
  package.json            # Dependances du projet
  src/
    constants.js          # Cle API, categories, donnees de demo
    screens/
      OnboardingScreen.js     # Ecran d'accueil au premier lancement
      SplashScreen.js         # Animation de splash au demarrage
      BriefingScreen.js       # Ecran principal avec liste des actualites
      SummaryScreen.js        # Resume/briefing avec synthese vocale
      ArticleDetailScreen.js  # Detail d'un article
      HistoryScreen.js        # Historique des briefings passes
      SettingsScreen.js       # Reglages (theme, notifications, sources)
    components/
      NewsCard.js         # Carte d'actualite avec numero, categorie, favori
      FilterBar.js        # Barre de filtrage par categorie
      SearchBar.js        # Barre de recherche d'articles
      OfflineBanner.js    # Banniere mode hors-ligne / synchronisation
      CacheInfoBar.js     # Indicateur de stockage cache (taille, nb articles)
      ChromeCorners.js    # Effets visuels chrome sur les cartes
    utils/
      theme.js            # Systeme de themes (sombre/clair) avec contexte React
      i18n.js             # Traductions (francais)
      cache.js            # Gestion du cache (sauvegarde, chargement, stats)
      network.js          # Detection du statut reseau (online/offline)
      notifications.js    # Notifications push quotidiennes
      favorites.js        # Gestion des articles favoris
      sources.js          # Selection des sources d'actualites
      date.js             # Formatage des dates et temps relatif
      haptics.js          # Retour haptique (vibrations)
      tts.js              # Synthese vocale (Text-to-Speech)
      summary.js          # Generation du resume des articles
```

## API utilisee

- [NewsAPI.org](https://newsapi.org) - Plan gratuit : 100 requetes/jour
- Endpoint : `GET /v2/top-headlines?country=fr&pageSize=5`
