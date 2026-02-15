import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { loadHistory, getCacheInfo } from '../utils/cache';
import { getCategoryInfo } from '../constants';
import { formatDateGroupLabel } from '../utils/date';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import { lightTap } from '../utils/haptics';

function AnimatedHistoryCard({ item, index, theme, lang, t, onPress }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 8, delay: index * 100, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, scaleAnim, index]);

  const category = getCategoryInfo(item.source?.name, item.category);
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';
  const time = item.publishedAt
    ? new Date(item.publishedAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => { lightTap(); onPress(item); }}
        style={[styles.historyCard, { backgroundColor: theme.cardBg, borderColor: theme.inputBorder }]}
      >
        <View style={styles.timelineDot} />
        <View style={styles.cardHeader}>
          <LinearGradient colors={theme.numberBadge} style={styles.miniNumber}>
            <Text style={[styles.miniNumberText, { color: theme.numberText }]}>{index + 1}</Text>
          </LinearGradient>
          <View style={[styles.miniCatBadge, { backgroundColor: category.bg }]}>
            <Text style={[styles.miniCatText, { color: category.color }]}>
              {category.emoji} {t(category.labelKey)}
            </Text>
          </View>
          <Text style={[styles.cardTime, { color: theme.textTertiary }]}>{time}</Text>
        </View>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]} numberOfLines={2}>{item.title}</Text>
        <View style={styles.cardFooter}>
          <Text style={[styles.cardSource, { color: theme.textTertiary }]}>{item.source?.name}</Text>
          {item.cachedAt ? (
            <View style={styles.cachedBadge}>
              <Text style={[styles.cachedBadgeText, { color: theme.cacheText }]}>💾 {t('saved')}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// History screen with animated cards
export default function HistoryScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, lang } = useI18n();
  const [sections, setSections] = useState([]);
  const [stats, setStats] = useState({ totalArticles: 0, days: 0, cached: 0 });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const history = await loadHistory();
        const info = await getCacheInfo();

        if (!active) return;

        const dateKeys = Object.keys(history).sort().reverse();
        const secs = dateKeys.map((dateKey) => ({
          title: formatDateGroupLabel(dateKey, lang),
          dateKey,
          isToday: dateKey === new Date().toISOString().split('T')[0],
          data: history[dateKey].articles || [],
        }));

        setSections(secs);
        setStats({
          totalArticles: info.totalArticles,
          days: info.days,
          cached: info.totalArticles,
        });
        setLoading(false);
      })();
      return () => { active = false; };
    }, [lang])
  );

  const handleCardPress = (article) => {
    navigation.navigate('ArticleDetail', { article });
  };

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <View style={[styles.dot, !section.isToday && styles.dotPast]} />
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }, section.isToday && { color: theme.accent }]}>
        {section.title}
      </Text>
      <Text style={[styles.sectionCount, { color: theme.textTertiary }]}>{section.data.length} {t('articles')}</Text>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <AnimatedHistoryCard item={item} index={index} theme={theme} lang={lang} t={t} onPress={handleCardPress} />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <LinearGradient
        colors={theme.bgGradient}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.headerBorder }]}>
        <View>
          <Text style={[styles.pageTitle, { color: theme.textTitle }]}>{t('history')}</Text>
          <Text style={[styles.pageSubtitle, { color: theme.textSubtitle }]}>{t('pastBriefings')}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🕐</Text>
          <Text style={[styles.emptyTitle, { color: theme.textSecondary }]}>{t('noHistory')}</Text>
          <Text style={[styles.emptyText, { color: theme.textTertiary }]}>{t('historyWillAppear')}</Text>
        </View>
      ) : (
        <>
          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.2)' }]}>
              <Text style={[styles.statNumber, { color: theme.accent }]}>{stats.totalArticles}</Text>
              <Text style={[styles.statLabel, { color: theme.textTertiary }]}>{t('articlesRead')}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.chipBg, borderColor: theme.inputBorder }]}>
              <Text style={[styles.statNumber, { color: theme.textPrimary }]}>{stats.days}</Text>
              <Text style={[styles.statLabel, { color: theme.textTertiary }]}>{t('days')}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.chipBg, borderColor: theme.inputBorder }]}>
              <Text style={[styles.statNumber, { color: theme.textPrimary }]}>{stats.cached}</Text>
              <Text style={[styles.statLabel, { color: theme.textTertiary }]}>{t('offline')}</Text>
            </View>
          </View>

          <SectionList
            sections={sections}
            keyExtractor={(item, index) => (item.url || item.title) + index}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12, opacity: 0.4 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptyText: { fontSize: 13 },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  statNumber: { fontSize: 22, fontWeight: '800' },
  statLabel: {
    fontSize: 10,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  dotPast: {
    backgroundColor: '#475569',
    shadowOpacity: 0,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700' },
  sectionCount: {
    fontSize: 11,
    marginLeft: 'auto',
  },
  historyCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    marginLeft: 20,
    borderWidth: 1,
    borderLeftWidth: 2,
  },
  timelineDot: {
    position: 'absolute',
    left: -14,
    top: 20,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  miniNumber: {
    width: 22,
    height: 22,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniNumberText: { fontSize: 11, fontWeight: '800' },
  miniCatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  miniCatText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  cardTime: { marginLeft: 'auto', fontSize: 10 },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardSource: { fontSize: 11 },
  cachedBadge: {},
  cachedBadgeText: { fontSize: 10 },
});
