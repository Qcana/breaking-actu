import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'briefing_sources';

// Sources françaises disponibles (NewsData.io)
export const AVAILABLE_SOURCES = [
  { id: 'lemonde', name: 'Le Monde', country: 'fr', emoji: '📰' },
  { id: 'lesechos', name: 'Les Échos', country: 'fr', emoji: '💼' },
  { id: 'liberation', name: 'Libération', country: 'fr', emoji: '📰' },
  { id: 'lefigaro', name: 'Le Figaro', country: 'fr', emoji: '📰' },
  { id: 'franceinfo', name: 'France Info', country: 'fr', emoji: '📡' },
  { id: 'france24', name: 'France 24', country: 'fr', emoji: '🌍' },
  { id: 'bfmtv', name: 'BFM TV', country: 'fr', emoji: '📺' },
  { id: 'lequipe', name: "L'Équipe", country: 'fr', emoji: '⚽' },
  { id: '20minutes', name: '20 Minutes', country: 'fr', emoji: '📰' },
  { id: 'leparisien', name: 'Le Parisien', country: 'fr', emoji: '📰' },
  { id: 'ouest-france', name: 'Ouest-France', country: 'fr', emoji: '📰' },
  { id: 'ladepeche', name: 'La Dépêche', country: 'fr', emoji: '📰' },
  { id: 'numerama', name: 'Numerama', country: 'fr', emoji: '⚡' },
  { id: 'rfi', name: 'RFI', country: 'fr', emoji: '🌍' },
];

// Sources anglaises disponibles
export const AVAILABLE_SOURCES_EN = [
  { id: 'bbc-news', name: 'BBC News', country: 'gb', emoji: '📰' },
  { id: 'the-guardian', name: 'The Guardian', country: 'gb', emoji: '📰' },
  { id: 'reuters', name: 'Reuters', country: 'us', emoji: '🌍' },
  { id: 'associated-press', name: 'Associated Press', country: 'us', emoji: '🌍' },
  { id: 'cnn', name: 'CNN', country: 'us', emoji: '📺' },
  { id: 'the-verge', name: 'The Verge', country: 'us', emoji: '⚡' },
  { id: 'espn', name: 'ESPN', country: 'us', emoji: '⚽' },
  { id: 'techcrunch', name: 'TechCrunch', country: 'us', emoji: '💻' },
];

export async function loadSelectedSources() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : []; // vide = toutes les sources
  } catch {
    return [];
  }
}

export async function saveSelectedSources(sourceIds) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sourceIds));
  } catch (e) {
    console.warn('Erreur sauvegarde sources:', e);
  }
}

export function getSourcesForLanguage(lang) {
  return lang === 'en' ? AVAILABLE_SOURCES_EN : AVAILABLE_SOURCES;
}

export function buildSourcesParam(selectedIds, lang) {
  if (!selectedIds || selectedIds.length === 0) return '';
  return selectedIds.join(',');
}
