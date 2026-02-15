import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryInfo } from '../constants';
import { formatDate } from '../utils/date';
import { isFavorite as checkFavorite, toggleFavorite } from '../utils/favorites';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import { mediumTap } from '../utils/haptics';

export default function NewsCard({ item, index, onPress, isCached }) {
  const { theme } = useTheme();
  const { t, lang } = useI18n();
  const category = getCategoryInfo(item.source?.name, item.category);
  const [fav, setFav] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const heartAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, index]);

  useEffect(() => {
    checkFavorite(item).then(setFav);
  }, [item]);

  const handleToggleFav = async () => {
    mediumTap();
    Animated.sequence([
      Animated.timing(heartAnim, { toValue: 1.4, duration: 150, useNativeDriver: true }),
      Animated.spring(heartAnim, { toValue: 1, tension: 100, friction: 5, useNativeDriver: true }),
    ]).start();

    await toggleFavorite(item);
    setFav(!fav);
  };

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPress?.(item)}
        style={styles.cardOuter}
      >
        <LinearGradient
          colors={theme.cardBorder}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardBorder}
        >
          <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
            <View style={styles.cardHeader}>
              <LinearGradient
                colors={theme.numberBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.numberBadge}
              >
                <Text style={[styles.numberText, { color: theme.numberText }]}>{index + 1}</Text>
              </LinearGradient>
              <View style={[styles.categoryBadge, { backgroundColor: category.bg }]}>
                <Text style={[styles.categoryText, { color: category.color }]}>
                  {category.emoji} {t(category.labelKey)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleToggleFav}
                style={styles.favBtn}
                activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
                  <Ionicons
                    name={fav ? 'heart' : 'heart-outline'}
                    size={18}
                    color={fav ? '#f9a8d4' : theme.textMuted}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>

            <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={3}>
              {item.title}
            </Text>

            {item.description ? (
              <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={3}>
                {item.description}
              </Text>
            ) : null}

            <View style={[styles.cardFooter, { borderTopColor: theme.footerBorder }]}>
              <Text style={[styles.sourceText, { color: theme.textTertiary }]}>{item.source?.name || t('unknownSource')}</Text>
              {item.publishedAt ? (
                <Text style={[styles.timeText, { color: theme.textTertiary }]}>{formatDate(item.publishedAt, lang)}</Text>
              ) : null}
            </View>

            {isCached ? (
              <View style={[styles.cacheIndicator, { backgroundColor: theme.cacheBg, borderColor: theme.cacheBorder }]}>
                <Text style={styles.cacheIcon}>💾</Text>
                <Text style={[styles.cacheText, { color: theme.cacheText }]}>{t('availableOffline')}</Text>
              </View>
            ) : null}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    marginBottom: 16,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardBorder: {
    borderRadius: 22,
    padding: 2,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  numberBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  numberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  favBtn: {
    marginLeft: 'auto',
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  sourceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 12,
  },
  cacheIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  cacheIcon: {
    fontSize: 11,
  },
  cacheText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
