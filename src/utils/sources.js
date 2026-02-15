import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'briefing_sources';

// Sources françaises disponibles
export const AVAILABLE_SOURCES = [
  { id: 'le-monde', name: 'Le Monde', country: 'fr', emoji: '📰' },
  { id: 'les-echos', name: 'Les Échos', country: 'fr', emoji: '💼' },
  { id: 'liberation', name: 'Libération', country: 'fr', emoji: '📰' },
  { id: 'le-figaro', name: 'Le Figaro', country: 'fr', emoji: '📰' },
  { id: 'france-info', name: 'France Info', country: 'fr', emoji: '📡' },
  { id: 'lequipe', name: "L'Équipe", country: 'fr', emoji: '⚽' },
  { id: 'france-culture', name: 'France Culture', country: 'fr', emoji: '🎵' },
  { id: '01net', name: '01net', country: 'fr', emoji: '⚡' },
  { id: 'bfm-tv', name: 'BFM TV', country: 'fr', emoji: '📺' },
  { id: 'tf1', name: 'TF1 Info', country: 'fr', emoji: '📺' },
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
