import { getCategoryInfo } from '../constants';

/**
 * Génère un résumé condensé local à partir des articles.
 * Extraction des phrases-clés + mise en forme narrative.
 * Peut être remplacé plus tard par un appel API Claude.
 */
export function generateLocalSummary(articles, options = {}) {
  const { filterCategory = null, lang = 'fr' } = options;

  if (!articles || articles.length === 0) {
    return {
      title: lang === 'en' ? 'No articles available' : 'Aucun article disponible',
      body: lang === 'en'
        ? 'No articles available to generate a summary.'
        : "Aucun article n'est disponible pour générer un résumé.",
      bulletPoints: [],
      spokenText: lang === 'en'
        ? "No articles available for today's briefing."
        : "Aucun article disponible pour le briefing d'aujourd'hui.",
    };
  }

  // Filtrer par catégorie si demandé
  let filtered = articles;
  if (filterCategory && filterCategory !== 'all') {
    filtered = articles.filter((a) => {
      const cat = getCategoryInfo(a.source?.name);
      return cat.key === filterCategory;
    });
    if (filtered.length === 0) filtered = articles;
  }

  const count = filtered.length;
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';
  const date = new Date().toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Labels de catégories selon la langue
  const catLabels = lang === 'en'
    ? { general: 'GENERAL', business: 'BUSINESS', technology: 'TECH', science: 'SCIENCE', health: 'HEALTH', sports: 'SPORTS', entertainment: 'CULTURE' }
    : { general: 'GÉNÉRAL', business: 'ÉCONOMIE', technology: 'TECHNO', science: 'SCIENCE', health: 'SANTÉ', sports: 'SPORT', entertainment: 'CULTURE' };

  // Extraire la première phrase significative de chaque description
  const bulletPoints = filtered.map((article) => {
    const cat = getCategoryInfo(article.source?.name);
    const desc = extractKeyPhrase(article.description || article.title);
    const label = catLabels[cat.key] || (lang === 'en' ? 'GENERAL' : 'GÉNÉRAL');
    return {
      emoji: cat.emoji,
      category: label,
      color: cat.color,
      title: article.title,
      summary: desc,
      source: article.source?.name || (lang === 'en' ? 'Unknown source' : 'Source inconnue'),
    };
  });

  // Générer le texte narratif
  const intro = lang === 'en'
    ? `Here's your briefing for ${date}. ${count} news item${count > 1 ? 's' : ''} to remember:`
    : `Voici votre briefing du ${date}. ${count} actualité${count > 1 ? 's' : ''} à retenir :`;

  const body = bulletPoints
    .map((bp, i) => `${i + 1}. **${bp.title}**\n   ${bp.summary} _(${bp.source})_`)
    .join('\n\n');

  // Texte pour le TTS
  const spokenIntro = lang === 'en'
    ? `Hello, here's your briefing for ${date}. ${count} news item${count > 1 ? 's' : ''} to remember.`
    : `Bonjour, voici votre briefing du ${date}. ${count} actualité${count > 1 ? 's' : ''} à retenir.`;

  const numberWord = lang === 'en' ? 'Number' : 'Numéro';
  const spokenItems = bulletPoints
    .map((bp, i) => `${numberWord} ${i + 1}, ${bp.category}. ${bp.title}. ${bp.summary}.`)
    .join(' ... ');

  const spokenOutro = lang === 'en'
    ? "That's all for today. Have a great day!"
    : "C'est tout pour aujourd'hui. Bonne journée !";

  const spokenText = `${spokenIntro} ... ${spokenItems} ... ${spokenOutro}`;

  const titlePrefix = lang === 'en' ? 'Briefing for' : 'Briefing du';

  return {
    title: `${titlePrefix} ${date}`,
    intro,
    body,
    bulletPoints,
    spokenText,
    articleCount: count,
    generatedAt: Date.now(),
  };
}

/**
 * Extrait la phrase-clé d'une description.
 */
function extractKeyPhrase(text) {
  if (!text) return '';

  const clean = text.replace(/\s+/g, ' ').trim();

  const match = clean.match(/^(.+?[.!?])\s/);
  if (match && match[1].length >= 20) {
    return match[1];
  }

  if (clean.length <= 150) return clean;
  const truncated = clean.substring(0, 150);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}
