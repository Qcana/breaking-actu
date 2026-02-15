import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  FAVORITES: 'briefing_favorites',
  FAVORITE_CATEGORIES: 'briefing_fav_categories',
};

// --- Articles favoris ---

export async function loadFavorites() {
  try {
    const data = await AsyncStorage.getItem(KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function toggleFavorite(article) {
  const favorites = await loadFavorites();
  const key = article.url || article.title;
  const index = favorites.findIndex((f) => (f.url || f.title) === key);

  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.unshift({
      ...article,
      favoritedAt: Date.now(),
    });
  }

  await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
  return favorites;
}

export async function isFavorite(article) {
  const favorites = await loadFavorites();
  const key = article.url || article.title;
  return favorites.some((f) => (f.url || f.title) === key);
}

// --- Catégories favorites ---

export async function loadFavoriteCategories() {
  try {
    const data = await AsyncStorage.getItem(KEYS.FAVORITE_CATEGORIES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function toggleFavoriteCategory(categoryKey) {
  const cats = await loadFavoriteCategories();
  const index = cats.indexOf(categoryKey);

  if (index >= 0) {
    cats.splice(index, 1);
  } else {
    cats.push(categoryKey);
  }

  await AsyncStorage.setItem(KEYS.FAVORITE_CATEGORIES, JSON.stringify(cats));
  return cats;
}
