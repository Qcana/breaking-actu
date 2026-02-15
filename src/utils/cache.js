import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDateKey } from './date';

const KEYS = {
  ARTICLES: 'briefing_articles',
  ARTICLES_TIMESTAMP: 'briefing_articles_ts',
  HISTORY: 'briefing_history',
  LAST_SYNC: 'briefing_last_sync',
};

// --- Articles courants (cache offline) ---

export async function saveArticles(articles) {
  try {
    await AsyncStorage.setItem(KEYS.ARTICLES, JSON.stringify(articles));
    await AsyncStorage.setItem(KEYS.ARTICLES_TIMESTAMP, Date.now().toString());
    await AsyncStorage.setItem(KEYS.LAST_SYNC, Date.now().toString());
  } catch (e) {
    console.warn('Erreur sauvegarde cache:', e);
  }
}

export async function loadCachedArticles() {
  try {
    const data = await AsyncStorage.getItem(KEYS.ARTICLES);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('Erreur lecture cache:', e);
    return null;
  }
}

export async function getLastSyncTime() {
  try {
    const ts = await AsyncStorage.getItem(KEYS.LAST_SYNC);
    return ts ? parseInt(ts, 10) : null;
  } catch {
    return null;
  }
}

// --- Historique ---

export async function saveToHistory(articles) {
  try {
    const dateKey = getDateKey();
    const history = await loadHistory();

    history[dateKey] = {
      date: dateKey,
      articles: articles.map((a) => ({
        title: a.title,
        description: a.description,
        source: a.source,
        publishedAt: a.publishedAt,
        url: a.url,
        urlToImage: a.urlToImage,
        cachedAt: Date.now(),
      })),
      fetchedAt: Date.now(),
    };

    // Garder max 30 jours
    const keys = Object.keys(history).sort().reverse();
    const trimmed = {};
    keys.slice(0, 30).forEach((k) => { trimmed[k] = history[k]; });

    await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Erreur sauvegarde historique:', e);
  }
}

export async function loadHistory() {
  try {
    const data = await AsyncStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.warn('Erreur lecture historique:', e);
    return {};
  }
}

// --- Infos cache ---

export async function getCacheInfo() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const briefingKeys = keys.filter((k) => k.startsWith('briefing_'));
    let totalSize = 0;
    for (const key of briefingKeys) {
      const val = await AsyncStorage.getItem(key);
      if (val) totalSize += val.length * 2; // approximation UTF-16
    }

    const history = await loadHistory();
    const totalArticles = Object.values(history).reduce(
      (sum, day) => sum + (day.articles?.length || 0),
      0
    );
    const days = Object.keys(history).length;

    return {
      sizeBytes: totalSize,
      sizeMB: (totalSize / (1024 * 1024)).toFixed(1),
      totalArticles,
      days,
    };
  } catch {
    return { sizeBytes: 0, sizeMB: '0', totalArticles: 0, days: 0 };
  }
}
