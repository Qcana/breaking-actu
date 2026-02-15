import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { API_KEY, PROXY_URL, DEMO_NEWS, getCategoryInfo } from '../constants';
import { getTodayFormatted } from '../utils/date';
import { saveArticles, loadCachedArticles, saveToHistory } from '../utils/cache';
import { useNetworkStatus } from '../utils/network';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import { loadSelectedSources, buildSourcesParam } from '../utils/sources';
import NewsCard from '../components/NewsCard';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import OfflineBanner from '../components/OfflineBanner';
import SkeletonCard, { SkeletonFilterChips, SkeletonSearchBar } from '../components/SkeletonCard';
import { lightTap } from '../utils/haptics';

export default function BriefingScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, lang } = useI18n();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { isConnected, lastSyncTime, updateLastSync } = useNetworkStatus();

  const fetchNews = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setIsDemo(false);

    if (!isConnected) {
      const cached = await loadCachedArticles();
      if (cached) {
        setNews(cached);
      } else {
        setNews(DEMO_NEWS);
        setIsDemo(true);
      }
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setIsSyncing(true);

    try {
      const selectedSources = await loadSelectedSources();
      const sourcesParam = buildSourcesParam(selectedSources, lang);
      let url;
      if (sourcesParam) {
        url = `${PROXY_URL}/top-headlines?sources=${sourcesParam}&pageSize=10`;
      } else {
        url = `${PROXY_URL}/top-headlines?pageSize=10`;
      }
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'ok' && data.articles?.length > 0) {
        setNews(data.articles);
        await saveArticles(data.articles);
        await saveToHistory(data.articles);
        updateLastSync();
      } else {
        const cached = await loadCachedArticles();
        if (cached) {
          setNews(cached);
        } else {
          setNews(DEMO_NEWS);
          setIsDemo(true);
          await saveArticles(DEMO_NEWS);
          await saveToHistory(DEMO_NEWS);
        }
      }
    } catch (err) {
      const cached = await loadCachedArticles();
      if (cached) {
        setNews(cached);
      } else {
        setNews(DEMO_NEWS);
        setIsDemo(true);
        await saveArticles(DEMO_NEWS);
        await saveToHistory(DEMO_NEWS);
      }
    }

    setIsSyncing(false);
    setLoading(false);
    setRefreshing(false);
  }, [isConnected, updateLastSync, lang]);

  useEffect(() => {
    fetchNews();
    // Rafraîchissement automatique toutes les 10 minutes
    const interval = setInterval(() => {
      fetchNews(true);
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    fetchNews(true);
  }, [fetchNews]);

  const handleCardPress = (article) => {
    navigation.navigate('ArticleDetail', { article });
  };

  // Filtrage par catégorie + recherche
  const filteredNews = news.filter((item) => {
    if (selectedCategory !== 'all') {
      const cat = getCategoryInfo(item.source?.name, item.category);
      if (cat.key !== selectedCategory) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = (item.title || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const source = (item.source?.name || '').toLowerCase();
      if (!title.includes(q) && !desc.includes(q) && !source.includes(q)) return false;
    }
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <LinearGradient
        colors={theme.bgGradient}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.headerBorder }]}>
        <View>
          <Text style={[styles.appTitle, { color: theme.textTitle }]}>{t('appTitle')}</Text>
          <Text style={[styles.dateText, { color: theme.textSubtitle }]}>{getTodayFormatted(lang)}</Text>
        </View>
        <TouchableOpacity
          onPress={() => { lightTap(); fetchNews(false); }}
          style={[styles.refreshButton, { backgroundColor: theme.buttonBg, borderColor: theme.buttonBorder }, !isConnected && { opacity: 0.4 }]}
          activeOpacity={0.7}
          disabled={!isConnected}
        >
          <Ionicons name="refresh-outline" size={22} color={theme.buttonText} />
        </TouchableOpacity>
      </View>

      {/* Contenu */}
      {loading ? (
        <View style={styles.list}>
          <SkeletonSearchBar />
          <SkeletonFilterChips />
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredNews}
          keyExtractor={(item, index) => item.url || index.toString()}
          renderItem={({ item, index }) => (
            <NewsCard
              item={item}
              index={index}
              onPress={handleCardPress}
              isCached={!isDemo}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.accent}
              colors={[theme.accent]}
            />
          }
          ListHeaderComponent={
            <>
              <OfflineBanner
                isConnected={isConnected}
                isSyncing={isSyncing}
                lastSyncTime={lastSyncTime}
              />
              {isDemo && isConnected ? (
                <View style={[styles.demoBanner, { backgroundColor: theme.chipBg, borderColor: theme.inputBorder }]}>
                  <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
                  <Text style={[styles.demoText, { color: theme.textSubtitle }]}>{t('demoBanner')}</Text>
                </View>
              ) : null}
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onClear={() => setSearchQuery('')}
              />
              <FilterBar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              {filteredNews.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>🔍</Text>
                  <Text style={[styles.emptyTitle, { color: theme.textSecondary }]}>{t('noArticles')}</Text>
                  <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
                    {searchQuery ? t('noSearchResults') : t('noCategoryResults')}
                  </Text>
                </View>
              ) : null}
            </>
          }
          ListFooterComponent={
            filteredNews.length > 0 ? (
              <Text style={[styles.footer, { color: theme.textMuted }]}>{t('pullToRefresh')}</Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 13,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  demoText: {
    fontSize: 12,
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
    opacity: 0.4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
  },
});
