import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { CATEGORIES } from '../constants';
import { loadCachedArticles } from '../utils/cache';
import { generateLocalSummary } from '../utils/summary';
import { speak, stop } from '../utils/tts';
import { getTodayFormatted } from '../utils/date';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import { lightTap } from '../utils/haptics';

export default function BriefingSummaryScreen() {
  const { theme } = useTheme();
  const { t, lang } = useI18n();
  const [articles, setArticles] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Pulsation TTS
  useEffect(() => {
    if (isTTSPlaying) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      anim.start();
      return () => anim.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isTTSPlaying, pulseAnim]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const cached = await loadCachedArticles();
        if (!active) return;
        setArticles(cached || []);
        setLoading(false);
      })();
      return () => {
        active = false;
        stop();
        setIsTTSPlaying(false);
      };
    }, [])
  );

  useEffect(() => {
    if (articles.length === 0) return;
    const result = generateLocalSummary(articles, { lang });
    setSummary(result);
  }, [articles, lang]);

  const handleTTS = async () => {
    lightTap();
    if (isTTSPlaying) {
      await stop();
      setIsTTSPlaying(false);
      return;
    }
    if (!summary?.spokenText) return;
    setIsTTSPlaying(true);
    await speak(
      summary.spokenText,
      () => setIsTTSPlaying(true),
      () => setIsTTSPlaying(false)
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <LinearGradient colors={theme.bgGradient} style={StyleSheet.absoluteFill} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.textSubtitle }]}>{t('preparingSummary')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <LinearGradient colors={theme.bgGradient} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.headerBorder }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.pageTitle, { color: theme.textTitle }]}>{t('tabBriefing')}</Text>
          <Text style={[styles.pageSubtitle, { color: theme.textSubtitle }]}>{getTodayFormatted(lang)}</Text>
        </View>
        {/* Bouton TTS */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            onPress={handleTTS}
            style={[
              styles.ttsBtn,
              { backgroundColor: theme.buttonBg, borderColor: theme.buttonBorder },
              isTTSPlaying && { backgroundColor: theme.accent, borderColor: theme.accent },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isTTSPlaying ? 'stop' : 'volume-high-outline'}
              size={22}
              color={isTTSPlaying ? '#fff' : theme.buttonText}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {summary && summary.bulletPoints.length > 0 ? (
          <View style={[styles.briefingCard, { backgroundColor: theme.cardBg, borderColor: theme.inputBorder }]}>
            {/* Intro */}
            <View style={[styles.introSection, { borderBottomColor: theme.footerBorder }]}>
              <LinearGradient
                colors={theme.numberBadge}
                style={styles.logoBadge}
              >
                <Text style={[styles.logoText, { color: theme.numberText }]}>BA</Text>
              </LinearGradient>
              <Text style={[styles.introText, { color: theme.textPrimary }]}>{summary.intro}</Text>
            </View>

            {/* Points clés */}
            {summary.bulletPoints.map((bp, i) => {
              const catKey = getCatKey(bp.category);
              const catInfo = CATEGORIES[catKey];
              return (
                <View
                  key={i}
                  style={[
                    styles.bulletRow,
                    i < summary.bulletPoints.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.footerBorder },
                  ]}
                >
                  <LinearGradient
                    colors={theme.numberBadge}
                    style={styles.bulletNumber}
                  >
                    <Text style={[styles.bulletNumberText, { color: theme.numberText }]}>{i + 1}</Text>
                  </LinearGradient>
                  <View style={styles.bulletContent}>
                    <View style={styles.bulletMeta}>
                      <View style={[styles.catBadge, { backgroundColor: catInfo?.bg || 'rgba(99,102,241,0.2)' }]}>
                        <Text style={styles.catEmoji}>{bp.emoji}</Text>
                        <Text style={[styles.catLabel, { color: bp.color }]}>{bp.category}</Text>
                      </View>
                      <Text style={[styles.bulletSource, { color: theme.textTertiary }]}>{bp.source}</Text>
                    </View>
                    <Text style={[styles.bulletTitle, { color: theme.textPrimary }]}>{bp.title}</Text>
                    <Text style={[styles.bulletSummary, { color: theme.textSecondary }]}>{bp.summary}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyCard, { backgroundColor: theme.cardBg, borderColor: theme.inputBorder }]}>
              <Text style={styles.emptyIcon}>📰</Text>
              <Text style={[styles.emptyTitle, { color: theme.textSecondary }]}>{t('noSummary')}</Text>
              <Text style={[styles.emptyText, { color: theme.textTertiary }]}>{t('loadArticlesFirst')}</Text>
            </View>
          </View>
        )}

        {/* TTS hint */}
        <View style={styles.ttsHint}>
          <Ionicons name="volume-medium-outline" size={14} color={theme.textTertiary} />
          <Text style={[styles.ttsHintText, { color: theme.textTertiary }]}>{t('ttsHint')}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function getCatKey(label) {
  const map = {
    'TOUT': 'all', 'ALL': 'all',
    'GÉNÉRAL': 'general', 'GENERAL': 'general',
    'ÉCONOMIE': 'business', 'BUSINESS': 'business',
    'TECHNO': 'technology', 'TECH': 'technology',
    'SCIENCE': 'science',
    'SANTÉ': 'health', 'HEALTH': 'health',
    'SPORT': 'sports', 'SPORTS': 'sports',
    'CULTURE': 'entertainment',
  };
  return map[label] || 'general';
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  loadingText: { marginTop: 16, fontSize: 15 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: { flex: 1 },
  pageTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 13, marginTop: 2, textTransform: 'capitalize' },

  ttsBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },

  // Carte briefing unique
  briefingCard: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
  },

  // Intro
  introSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderBottomWidth: 1,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  introText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },

  // Bullet rows
  bulletRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  bulletNumber: {
    width: 28,
    height: 28,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  bulletNumberText: { fontSize: 13, fontWeight: '800' },
  bulletContent: { flex: 1 },
  bulletMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  catEmoji: { fontSize: 10 },
  catLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  bulletSource: { fontSize: 10, marginLeft: 'auto' },
  bulletTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 4,
  },
  bulletSummary: {
    fontSize: 13,
    lineHeight: 19,
  },

  // Empty
  emptyContainer: { paddingTop: 40 },
  emptyCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: { fontSize: 40, marginBottom: 12, opacity: 0.4 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptyText: { fontSize: 13, textAlign: 'center' },

  // TTS hint
  ttsHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    marginTop: 8,
  },
  ttsHintText: { fontSize: 11 },
});
