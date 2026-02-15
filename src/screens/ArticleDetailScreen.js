import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryInfo } from '../constants';
import { formatDate, formatFullDate } from '../utils/date';
import { isFavorite as checkFavorite, toggleFavorite } from '../utils/favorites';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import { lightTap, mediumTap } from '../utils/haptics';

export default function ArticleDetailScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { t, lang } = useI18n();
  const { article } = route.params;
  const category = getCategoryInfo(article.source?.name, article.category);
  const [fav, setFav] = useState(false);
  const [heartAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    checkFavorite(article).then(setFav);
  }, [article]);

  const handleOpenURL = () => {
    lightTap();
    if (article.url) {
      Linking.openURL(article.url);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.url || ''}`,
      });
    } catch {}
  };

  const handleToggleFav = async () => {
    mediumTap();
    Animated.sequence([
      Animated.timing(heartAnim, { toValue: 1.4, duration: 150, useNativeDriver: true }),
      Animated.spring(heartAnim, { toValue: 1, tension: 100, friction: 5, useNativeDriver: true }),
    ]).start();

    await toggleFavorite(article);
    setFav(!fav);
  };

  const sourceInitials = (article.source?.name || 'NA')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <LinearGradient
        colors={theme.bgGradient}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.headerBorder }]}>
        <TouchableOpacity
          onPress={() => { lightTap(); navigation.goBack(); }}
          style={[styles.headerBtn, { backgroundColor: theme.buttonBg, borderColor: theme.buttonBorder }]}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textSecondary }]}>{t('article')}</Text>
        <TouchableOpacity
          onPress={handleToggleFav}
          style={[styles.headerBtn, { backgroundColor: theme.buttonBg, borderColor: theme.buttonBorder }]}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
            <Ionicons
              name={fav ? 'heart' : 'heart-outline'}
              size={20}
              color={fav ? '#f9a8d4' : theme.textSecondary}
            />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShare}
          style={[styles.headerBtn, { backgroundColor: theme.buttonBg, borderColor: theme.buttonBorder }]}
          activeOpacity={0.7}
        >
          <Ionicons name="share-outline" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Metadata */}
        <View style={styles.meta}>
          <View style={[styles.categoryBadge, { backgroundColor: category.bg }]}>
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text style={[styles.categoryLabel, { color: category.color }]}>
              {t(category.labelKey)}
            </Text>
          </View>
          {article.publishedAt ? (
            <View style={[styles.timeBadge, { backgroundColor: theme.chipBg, borderColor: theme.inputBorder }]}>
              <Text style={[styles.timeText, { color: theme.textSubtitle }]}>{formatDate(article.publishedAt, lang)}</Text>
            </View>
          ) : null}
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.textPrimary }]}>{article.title}</Text>

        {/* Source */}
        <View style={[styles.sourceInfo, { borderTopColor: theme.inputBorder, borderBottomColor: theme.inputBorder }]}>
          <LinearGradient
            colors={['rgba(99,102,241,0.3)', 'rgba(168,85,247,0.3)']}
            style={styles.sourceAvatar}
          >
            <Text style={[styles.sourceInitials, { color: theme.accent }]}>{sourceInitials}</Text>
          </LinearGradient>
          <View>
            <Text style={[styles.sourceName, { color: theme.textPrimary }]}>{article.source?.name || t('unknownSource')}</Text>
            {article.publishedAt ? (
              <Text style={[styles.sourceDate, { color: theme.textTertiary }]}>{formatFullDate(article.publishedAt, lang)}</Text>
            ) : null}
          </View>
        </View>

        {/* Body */}
        {article.description ? (
          <Text style={[styles.body, { color: theme.textSecondary }]}>{article.description}</Text>
        ) : null}

        {article.content ? (
          <Text style={[styles.body, { color: theme.textSecondary }]}>{article.content.replace(/\[\+\d+ chars?\]/, '')}</Text>
        ) : null}

        {/* Separator */}
        <LinearGradient
          colors={['transparent', 'rgba(192,192,192,0.25)', 'rgba(255,255,255,0.35)', 'rgba(192,192,192,0.25)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.separator}
        />

        {/* Read full article */}
        {article.url ? (
          <TouchableOpacity
            onPress={handleOpenURL}
            style={[styles.openBtn, { backgroundColor: 'rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.3)' }]}
            activeOpacity={0.7}
          >
            <Ionicons name="link-outline" size={18} color={theme.accent} />
            <Text style={[styles.openBtnText, { color: theme.accent }]}>{t('readFullArticle')}</Text>
          </TouchableOpacity>
        ) : null}

        {/* Cache badge */}
        <View style={[styles.cacheBadge, { backgroundColor: theme.cacheBg, borderColor: theme.cacheBorder }]}>
          <Text style={styles.cacheBadgeIcon}>💾</Text>
          <Text style={[styles.cacheBadgeText, { color: theme.cacheText }]}>{t('savedOffline')}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  heroContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
    height: 200,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroPlaceholder: {
    backgroundColor: 'rgba(99,102,241,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPlaceholderIcon: { fontSize: 40, opacity: 0.3, marginBottom: 8 },
  heroPlaceholderText: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  categoryEmoji: { fontSize: 13 },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  timeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  timeText: { fontSize: 12 },
  title: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 33,
    letterSpacing: -0.5,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  sourceAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceInitials: { fontSize: 14, fontWeight: '800' },
  sourceName: { fontSize: 14, fontWeight: '600' },
  sourceDate: { fontSize: 12, marginTop: 2 },
  body: {
    fontSize: 15,
    lineHeight: 26,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  separator: {
    height: 1,
    marginHorizontal: 20,
    marginVertical: 24,
  },
  openBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  openBtnText: { fontSize: 14, fontWeight: '600' },
  cacheBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  cacheBadgeIcon: { fontSize: 13 },
  cacheBadgeText: { fontSize: 11 },
});
