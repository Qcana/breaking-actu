# Briefing Actu

Application mobile et web React Native (Expo) qui affiche les actualites les plus importantes du jour en France, en temps reel.

## Demo

- **Web** : [https://qcana.github.io/breaking-actu/](https://qcana.github.io/breaking-actu/)
- **Android APK** : disponible via EAS Build

## Fonctionnalites

- Affichage des actualites principales via NewsData.io (temps reel)
- 7 categories : International, Politique, Economie, Societe, Techno, Science, Sport
- 14 sources francaises disponibles (Le Monde, Le Figaro, BFM TV, France Info, etc.)
- Filtrage par categorie et recherche d'articles
- Pull-to-refresh + rafraichissement automatique toutes les 10 minutes
- Affichage du temps relatif ("Il y a 2h", "Il y a 30 min")
- Skeleton loading anime pendant le chargement
- Logo diamant anime avec rotation 360 a l'onboarding
- Ecran de resume/briefing avec synthese vocale (voix systeme, gratuit et illimite)
- Choix de la voix francaise dans les Reglages
- Systeme de favoris avec animation
- Historique des briefings passes avec timeline et statistiques
- Mode hors-ligne avec cache automatique et indicateur de stockage
- Banniere offline/sync avec barre de progression
- Notifications push quotidiennes configurables (heure au choix, compatible web et mobile)
- Ecran d'onboarding anime au premier lancement
- Retour haptique sur toutes les interactions
- Animations d'entree en cascade sur les cartes
- Theme sombre/clair commutable
- Selection des sources d'actualites

## Architecture

L'application utilise un **proxy Express** (`proxy.js`) deploye sur **Render** qui sert d'intermediaire entre le front et les APIs externes :
- Contourne les restrictions CORS pour le web
- Masque les cles API (non exposees dans le navigateur)
- Protection par token secret (`x-api-token`)
- Adapte le format de reponse des APIs pour le front

**API utilisee via le proxy :**
- **NewsData.io** — Actualites en temps reel

**TTS (synthese vocale) :**
- **expo-speech** — Voix natives du systeme (gratuit, illimite, pas de serveur requis)

## Deploiement

| Service | Usage | URL |
|---------|-------|-----|
| **GitHub Pages** | Site web statique | [qcana.github.io/breaking-actu](https://qcana.github.io/breaking-actu/) |
| **Render** | Proxy API (backend) | Heberge sur Render (free tier) |
| **EAS Build** | APK Android | Via Expo Application Services |

## Pre-requis

- **Node.js** (v18 ou superieur)
- **Expo CLI** : installe automatiquement via npx
- **Un compte NewsData.io** : cree un compte gratuit sur [newsdata.io](https://newsdata.io) pour obtenir une cle API (200 requetes/jour)
- **Expo Go** (app mobile) : installe sur ton telephone depuis l'App Store ou Google Play

## Installation

1. Clone le repo :
   ```
   git clone https://github.com/Qcana/breaking-actu.git
   cd breaking-actu
   ```

2. Installe les dependances :
   ```
   npm install
   ```

3. Configure tes cles API dans un fichier `.env` :
   ```
   NEWSDATA_KEY=ta_cle_newsdata
   API_SECRET=ton_secret_pour_le_proxy
   ```

## Lancement (developpement)

Deux terminaux sont necessaires :

**Terminal 1 — Proxy API :**
```
npm run proxy
```

**Terminal 2 — Application Expo :**
```
npm run web
```

Autres options :
- **Sur telephone** : `npx expo start` puis scanne le QR code avec Expo Go
- **Sur Android** : `npm run android`

## Build production

### Web (GitHub Pages)
```
npx expo export --platform web
```
Puis deployer le dossier `dist/` sur GitHub Pages (branche `gh-pages`).

### Android (APK)
```
npx eas-cli build --platform android --profile preview
```
Genere un APK installable via Expo Application Services.

## Structure du projet

```
briefing-actu/
  App.js                  # Point d'entree, navigation principale (tabs + stacks)
  proxy.js                # Proxy Express (relais vers NewsData.io)
  .env                    # Cles API (gitignore)
  eas.json                # Configuration EAS Build (APK/AAB)
  src/
    constants.js          # Categories, URL proxy, token API
    screens/
      OnboardingScreen.js     # Onboarding anime avec rotation diamant
      SplashScreen.js         # Splash screen avec logo diamant
      BriefingScreen.js       # Liste des actualites avec skeleton loading
      SummaryScreen.js        # Resume/briefing avec synthese vocale
      ArticleDetailScreen.js  # Detail d'un article
      HistoryScreen.js        # Historique des briefings passes
      SettingsScreen.js       # Reglages (theme, notifications, voix, sources)
    components/
      NewsCard.js         # Carte d'actualite avec numero, categorie, favori
      SkeletonCard.js     # Skeleton loading anime
      FilterBar.js        # Barre de filtrage par categorie
      SearchBar.js        # Barre de recherche d'articles
      OfflineBanner.js    # Banniere mode hors-ligne
      CacheInfoBar.js     # Indicateur de stockage cache
      ChromeCorners.js    # Effets visuels chrome
    utils/
      theme.js            # Themes sombre/clair
      i18n.js             # Traductions (francais/anglais)
      cache.js            # Gestion du cache
      network.js          # Detection reseau
      notifications.js    # Notifications push (web + mobile)
      favorites.js        # Articles favoris
      sources.js          # Sources d'actualites (14 sources FR)
      date.js             # Formatage des dates
      haptics.js          # Retour haptique
      tts.js              # Synthese vocale via expo-speech
      summary.js          # Generation du resume
```

## API utilisee

### NewsData.io (actualites)
- [newsdata.io](https://newsdata.io) - Plan gratuit : 200 requetes/jour
- Endpoint : `GET /api/1/latest?country=fr&language=fr`
- Articles en temps reel
