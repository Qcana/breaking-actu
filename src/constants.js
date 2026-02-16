// Configuration API
import Constants from 'expo-constants';

const isLocal = typeof window !== 'undefined' && window.location?.hostname === 'localhost';
export const PROXY_URL = isLocal
  ? 'http://localhost:3001/api'
  : 'https://briefing-actu1248745721048.onrender.com/api';

const API_SECRET = Constants.expoConfig?.extra?.apiSecret || '';

// Helper pour ajouter le token aux requetes
export function proxyFetch(url, options = {}) {
  const headers = { ...options.headers, 'x-api-token': API_SECRET };
  return fetch(url, { ...options, headers });
}

// Catégories avec couleurs et emojis
// labelKey correspond aux clés de traduction dans i18n.js
export const CATEGORIES = {
  all:           { key: 'all',           labelKey: 'catAll',           emoji: '✦', color: '#e2e8f0', bg: 'rgba(192,192,192,0.15)' },
  international: { key: 'international', labelKey: 'catInternational', emoji: '🌍', color: '#a5b4fc', bg: 'rgba(99,102,241,0.2)' },
  politique:     { key: 'politique',     labelKey: 'catPolitique',     emoji: '🏛️', color: '#cbd5e1', bg: 'rgba(148,163,184,0.2)' },
  economie:      { key: 'economie',      labelKey: 'catEconomie',      emoji: '💼', color: '#6ee7b7', bg: 'rgba(5,150,105,0.2)' },
  societe:       { key: 'societe',       labelKey: 'catSociete',       emoji: '👥', color: '#fdba74', bg: 'rgba(234,88,12,0.2)' },
  technology:    { key: 'technology',    labelKey: 'catTechnology',    emoji: '⚡', color: '#fcd34d', bg: 'rgba(217,119,6,0.2)' },
  science:       { key: 'science',       labelKey: 'catScience',       emoji: '🔬', color: '#c4b5fd', bg: 'rgba(139,92,246,0.2)' },
  sports:        { key: 'sports',        labelKey: 'catSports',        emoji: '⚽', color: '#93c5fd', bg: 'rgba(37,99,235,0.2)' },
};

// Mapping des catégories NewsData.io vers les catégories de l'app
const API_CAT_MAP = {
  politics: 'politique',
  business: 'economie',
  economics: 'economie',
  technology: 'technology',
  science: 'science',
  health: 'societe',
  sports: 'sports',
  entertainment: 'societe',
  environment: 'societe',
  world: 'international',
  domestic: 'societe',
  lifestyle: 'societe',
  tourism: 'societe',
  food: 'societe',
  education: 'societe',
  crime: 'societe',
  top: 'international',
};

export function getCategoryInfo(source, apiCategories) {
  // 1. Utiliser les catégories de l'API si disponibles
  if (apiCategories && Array.isArray(apiCategories) && apiCategories.length > 0) {
    for (const cat of apiCategories) {
      const mapped = API_CAT_MAP[cat];
      if (mapped && CATEGORIES[mapped]) return CATEGORIES[mapped];
    }
  }

  // 2. Fallback : détection par nom de source
  const name = (source || '').toLowerCase();
  if (name.includes('tech') || name.includes('numerama') || name.includes('01net'))
    return CATEGORIES.technology;
  if (name.includes('sport') || name.includes('equipe') || name.includes('10sport'))
    return CATEGORIES.sports;
  if (name.includes('capital') || name.includes('échos') || name.includes('echos') || name.includes('bourse') || name.includes('business'))
    return CATEGORIES.economie;
  if (name.includes('politique') || name.includes('élysée') || name.includes('assemblée'))
    return CATEGORIES.politique;
  if (name.includes('science'))
    return CATEGORIES.science;
  if (name.includes('société') || name.includes('social') || name.includes('santé') || name.includes('culture'))
    return CATEGORIES.societe;
  if (name.includes('international') || name.includes('monde') || name.includes('france24') || name.includes('rfi'))
    return CATEGORIES.international;
  return CATEGORIES.international;
}

// Données de démonstration
export const DEMO_NEWS = [
  {
    title: "Sommet européen : accord historique sur la défense commune",
    description: "Les 27 pays membres ont trouvé un accord sur un plan de défense commun doté de 150 milliards d'euros sur cinq ans.",
    source: { name: "Le Monde" },
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    url: 'https://lemonde.fr',
  },
  {
    title: "La BCE maintient ses taux directeurs inchangés",
    description: "Christine Lagarde a annoncé une pause dans le cycle de baisse des taux, citant les incertitudes géopolitiques.",
    source: { name: "Les Échos" },
    publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    url: 'https://lesechos.fr',
  },
  {
    title: "L'IA générative franchit un cap dans la recherche médicale",
    description: "Un nouveau modèle d'intelligence artificielle a identifié trois molécules prometteuses contre la maladie d'Alzheimer.",
    source: { name: "France Info" },
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    url: 'https://franceinfo.fr',
  },
  {
    title: "Ligue des Champions : le PSG s'impose 3-1 à Munich",
    description: "Victoire éclatante du Paris Saint-Germain en huitièmes de finale grâce à un doublé de Dembélé.",
    source: { name: "L'Équipe" },
    publishedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    url: 'https://lequipe.fr',
  },
  {
    title: "César 2026 : « Les Enfants du silence » rafle cinq récompenses",
    description: "Le film de Julie Bertrand a dominé la cérémonie avec le César du meilleur film et de la meilleure réalisation.",
    source: { name: "France Culture" },
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    url: 'https://radiofrance.fr',
  },
];
