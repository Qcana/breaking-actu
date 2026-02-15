// Configuration API
export const API_KEY = '70cb5569601d449ea2bb7cc2223c9b5e';

// Catégories avec couleurs et emojis
// labelKey correspond aux clés de traduction dans i18n.js
export const CATEGORIES = {
  all:           { key: 'all',           labelKey: 'catAll',           emoji: '✦', color: '#e2e8f0', bg: 'rgba(192,192,192,0.15)' },
  international: { key: 'international', labelKey: 'catInternational', emoji: '🌍', color: '#a5b4fc', bg: 'rgba(99,102,241,0.2)' },
  politique:     { key: 'politique',     labelKey: 'catPolitique',     emoji: '🏛️', color: '#cbd5e1', bg: 'rgba(148,163,184,0.2)' },
  societe:       { key: 'societe',       labelKey: 'catSociete',       emoji: '👥', color: '#fdba74', bg: 'rgba(234,88,12,0.2)' },
  bourse:        { key: 'bourse',        labelKey: 'catBourse',        emoji: '📈', color: '#6ee7b7', bg: 'rgba(5,150,105,0.2)' },
  entreprise:    { key: 'entreprise',    labelKey: 'catEntreprise',    emoji: '🏢', color: '#67e8f9', bg: 'rgba(6,182,212,0.2)' },
  technology:    { key: 'technology',    labelKey: 'catTechnology',    emoji: '⚡', color: '#fcd34d', bg: 'rgba(217,119,6,0.2)' },
  science:       { key: 'science',       labelKey: 'catScience',       emoji: '🔬', color: '#c4b5fd', bg: 'rgba(139,92,246,0.2)' },
  health:        { key: 'health',        labelKey: 'catHealth',        emoji: '🏥', color: '#fca5a5', bg: 'rgba(220,38,38,0.2)' },
  sports:        { key: 'sports',        labelKey: 'catSports',        emoji: '⚽', color: '#93c5fd', bg: 'rgba(37,99,235,0.2)' },
  entertainment: { key: 'entertainment', labelKey: 'catEntertainment', emoji: '🎵', color: '#f9a8d4', bg: 'rgba(219,39,119,0.2)' },
  environnement: { key: 'environnement', labelKey: 'catEnvironnement', emoji: '🌱', color: '#86efac', bg: 'rgba(22,163,74,0.2)' },
};

export function getCategoryInfo(source) {
  const name = (source || '').toLowerCase();
  if (name.includes('tech') || name.includes('wired') || name.includes('verge'))
    return CATEGORIES.technology;
  if (name.includes('sport') || name.includes('equipe') || name.includes('espn'))
    return CATEGORIES.sports;
  if (name.includes('bourse') || name.includes('trading') || name.includes('cac'))
    return CATEGORIES.bourse;
  if (name.includes('entreprise') || name.includes('business') || name.includes('échos'))
    return CATEGORIES.entreprise;
  if (name.includes('politique') || name.includes('élysée') || name.includes('assemblée'))
    return CATEGORIES.politique;
  if (name.includes('société') || name.includes('social'))
    return CATEGORIES.societe;
  if (name.includes('international') || name.includes('monde') || name.includes('reuters') || name.includes('afp'))
    return CATEGORIES.international;
  if (name.includes('culture') || name.includes('césar'))
    return CATEGORIES.entertainment;
  if (name.includes('science'))
    return CATEGORIES.science;
  if (name.includes('santé') || name.includes('health'))
    return CATEGORIES.health;
  if (name.includes('climat') || name.includes('environnement') || name.includes('écologie') || name.includes('énergie'))
    return CATEGORIES.environnement;
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
