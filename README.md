# Briefing Actu

Application mobile React Native (Expo) qui affiche les 10 actualites les plus importantes du jour en France, en temps reel.

## Fonctionnalites

- Affichage des 10 actualites principales via NewsData.io (temps reel)
- 7 categories : International, Politique, Economie, Societe, Techno, Science, Sport
- 14 sources francaises disponibles (Le Monde, Le Figaro, BFM TV, France Info, etc.)
- Filtrage par categorie et recherche d'articles
- Pull-to-refresh + rafraichissement automatique toutes les 10 minutes
- Affichage du temps relatif ("Il y a 2h", "Il y a 30 min")
- Design epure avec cartes numerotees et effets chrome
- Ecran de resume/briefing avec synthese vocale via ElevenLabs (voix naturelles)
- Choix de la voix dans les Reglages : Roger, George, Sarah, Alice
- Systeme de favoris avec animation
- Historique des briefings passes avec timeline et statistiques
- Mode hors-ligne avec cache automatique et indicateur de stockage
- Banniere offline/sync avec barre de progression
- Notifications push quotidiennes configurables (heure au choix dans les Reglages, compatible web et mobile)
- Ecran d'onboarding au premier lancement
- Retour haptique sur toutes les interactions
- Animations d'entree en cascade sur les cartes
- Theme sombre/clair commutable
- Selection des sources d'actualites

## Architecture

L'application utilise un **proxy Express** (`proxy.js`) qui sert d'intermediaire entre le front et les APIs externes. Cela permet de :
- Contourner les restrictions CORS pour le web
- Masquer les cles API (non exposees dans le navigateur)
- Adapter le format de reponse des APIs pour le front
- Changer d'API facilement sans modifier le front

**APIs utilisees via le proxy :**
- **NewsData.io** — Actualites en temps reel
- **ElevenLabs** — Synthese vocale avec voix naturelles

## Pre-requis

- **Node.js** (v18 ou superieur)
- **Expo CLI** : installe automatiquement via npx
- **Un compte NewsData.io** : cree un compte gratuit sur [newsdata.io](https://newsdata.io) pour obtenir une cle API (200 requetes/jour)
- **Un compte ElevenLabs** : cree un compte gratuit sur [elevenlabs.io](https://elevenlabs.io) pour la synthese vocale (10 000 caracteres/mois)
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

3. **Configure tes cles API** dans `proxy.js` :
   - `NEWSDATA_KEY` : ta cle NewsData.io
   - `ELEVENLABS_KEY` : ta cle ElevenLabs

## Lancement

Deux terminaux sont necessaires :

**Terminal 1 — Proxy API :**
```
npm run proxy
```

**Terminal 2 — Application Expo :**
```
npm run web
```

Autres options de lancement :
- **Sur telephone** : `npx expo start` puis scanne le QR code avec Expo Go
- **Sur Android** : `npm run android` (necessite un emulateur)

## Structure du projet

```
briefing-actu/
  App.js                  # Point d'entree, navigation principale (tabs + stacks)
  index.js                # Enregistrement de l'app Expo
  proxy.js                # Proxy Express (relais vers NewsData.io + ElevenLabs TTS)
  package.json            # Dependances du projet
  src/
    constants.js          # Categories, donnees de demo, URL du proxy
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
      notifications.js    # Notifications push quotidiennes (web + mobile)
      favorites.js        # Gestion des articles favoris
      sources.js          # Selection des sources d'actualites (14 sources FR)
      date.js             # Formatage des dates et temps relatif
      haptics.js          # Retour haptique (vibrations)
      tts.js              # Synthese vocale via ElevenLabs (choix de voix)
      summary.js          # Generation du resume des articles
```

## APIs utilisees

### NewsData.io (actualites)
- [newsdata.io](https://newsdata.io) - Plan gratuit : 200 requetes/jour
- Endpoint : `GET /api/1/latest?country=fr&language=fr`
- Filtrage natif par langue francaise
- Articles en temps reel (pas de delai)

### ElevenLabs (synthese vocale)
- [elevenlabs.io](https://elevenlabs.io) - Plan gratuit : 10 000 caracteres/mois
- Voix disponibles : Roger, George, Sarah, Alice
- Modele : `eleven_multilingual_v2` (support natif du francais)
- Voix naturelles et expressives, selectionnables dans les Reglages
