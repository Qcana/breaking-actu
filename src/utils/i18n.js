import React, { createContext, useContext, useCallback } from 'react';

const translations = {
  fr: {
    // Tabs
    tabBriefing: 'Briefing',
    tabNews: 'Actu',
    tabHistory: 'Historique',
    tabSettings: 'Réglages',

    // Briefing Screen
    appTitle: 'Briefing Actu',
    searchPlaceholder: 'Rechercher un article...',
    loading: 'Recherche des actualités...',
    demoBanner: 'Mode démo — NewsAPI gratuit ne fonctionne pas sur mobile',
    noArticles: 'Aucun article',
    noSearchResults: 'Aucun résultat pour cette recherche',
    noCategoryResults: 'Aucun article dans cette catégorie',
    pullToRefresh: 'Tire vers le bas pour actualiser',

    filterCategories: 'Catégories',

    // Categories
    catAll: 'TOUT',
    catInternational: 'INTERNATIONAL',
    catPolitique: 'POLITIQUE',
    catSociete: 'SOCIÉTÉ',
    catBourse: 'BOURSE',
    catEntreprise: 'ENTREPRISE',
    catTechnology: 'TECHNO',
    catScience: 'SCIENCE',
    catHealth: 'SANTÉ',
    catSports: 'SPORT',
    catEntertainment: 'CULTURE',
    catEnvironnement: 'ENVIRONNEMENT',

    // History Screen
    history: 'Historique',
    pastBriefings: 'Vos briefings passés',
    noHistory: 'Aucun historique',
    historyWillAppear: 'Vos briefings apparaîtront ici',
    articlesRead: 'Articles lus',
    days: 'Jours',
    offline: 'Hors-ligne',
    articles: 'articles',
    saved: 'Sauvegardé',

    // Summary Screen
    summary: 'Résumé',
    preparingSummary: 'Préparation du résumé...',
    modeGeneral: 'Général',
    modeFavorites: 'Mes favoris',
    modeByTheme: 'Par thème',
    noFavoriteThemes: 'Aucun thème favori. Ajoutez des favoris depuis le briefing.',
    favoriteThemes: 'Thèmes favoris : ',
    noSummary: 'Aucun résumé disponible',
    loadArticlesFirst: 'Consultez d\'abord le briefing pour charger les articles',
    ttsHint: 'Appuyez sur le bouton pour écouter le résumé',
    noArticlesAvailable: 'Aucun article disponible',
    noArticlesForSummary: "Aucun article n'est disponible pour générer un résumé.",
    noArticlesTTS: "Aucun article disponible pour le briefing d'aujourd'hui.",
    briefingOf: 'Voici votre briefing du',
    toRemember: 'à retenir :',
    ttsBriefingOf: 'Bonjour, voici votre briefing du',
    ttsNumber: 'Numéro',
    ttsOutro: "C'est tout pour aujourd'hui. Bonne journée !",
    summaryTitle: 'Briefing du',

    // Article Detail
    article: 'Article',
    articleImage: "Image de l'article",
    unknownSource: 'Source inconnue',
    readFullArticle: "Lire l'article complet",
    savedOffline: 'Article sauvegardé hors-ligne',
    availableOffline: 'Disponible hors-ligne',

    // Cache Info
    localStorageTitle: 'Stockage local',
    savedArticlesCount: 'articles sauvegardés',
    expiresIn: 'Expire dans',

    // Offline Banner
    offlineMode: 'Mode hors-ligne',
    showingSavedArticles: 'Affichage des articles sauvegardés',
    lastSync: 'Dernière sync il y a',
    min: 'min',
    neverSynced: 'Aucune synchronisation',
    syncing: 'Synchronisation en cours...',
    updatingArticles: 'Mise à jour des articles',

    // Dates
    today: "Aujourd'hui",
    yesterday: 'Hier',
    ago: 'Il y a',
    hours: 'h',

    // Settings
    settings: 'Réglages',
    appearance: 'Apparence',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    language: 'Langue',
    french: 'Français',
    english: 'English',
    newsSources: 'Sources d\'actualités',
    selectSources: 'Sélectionnez vos sources préférées',
    allSources: 'Toutes les sources',
    savedAuto: 'Sauvegardé automatiquement',
    done: 'Terminé',
    version: 'Version',

    // Notifications
    notifications: 'Notifications',
    dailyNotifications: 'Rappel quotidien',
    notifTime: 'Heure du rappel',
    notifEnabled: 'Activé',
    notifTitle: 'Briefing Actu',
    notifBody: 'Votre briefing du jour est prêt !',

    // Replay
    replayOnboarding: "Revoir l'écran d'accueil",

    // Onboarding
    onboardingWelcome: 'Bienvenue',
    onboardingSubtitle: "L'essentiel de l'actu, chaque jour",
    onboardingBriefing: 'Votre briefing quotidien',
    onboardingBriefingDesc: 'Recevez chaque jour un résumé des actualités les plus importantes',
    onboardingCustomize: 'Personnalisez',
    onboardingCustomizeDesc: 'Choisissez vos sources et activez les notifications',
    onboardingNext: 'Suivant',
    onboardingStart: 'Commencer',
  },
};

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const lang = 'fr';

  const t = useCallback((key) => {
    return translations.fr[key] || key;
  }, []);

  return (
    <I18nContext.Provider value={{ lang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
