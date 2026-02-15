import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getCacheInfo } from '../utils/cache';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';

const MAX_CACHE_MB = 5;

export default function CacheInfoBar() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    getCacheInfo().then(setInfo);
  }, []);

  if (!info || info.totalArticles === 0) return null;

  const sizeMB = parseFloat(info.sizeMB) || 0;
  const fillPercent = Math.min((sizeMB / MAX_CACHE_MB) * 100, 100);

  return (
    <View style={[styles.container, { backgroundColor: theme.settingsBg, borderColor: theme.settingsBorder }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textSecondary }]}>
          {t('localStorageTitle')}
        </Text>
        <Text style={[styles.size, { color: theme.textTertiary }]}>
          {info.sizeMB} Mo / {MAX_CACHE_MB} Mo
        </Text>
      </View>

      <View style={[styles.bar, { backgroundColor: theme.inputBg }]}>
        <LinearGradient
          colors={['#6366f1', '#a5b4fc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barFill, { width: `${fillPercent}%` }]}
        />
      </View>

      <View style={styles.detail}>
        <Text style={[styles.detailText, { color: theme.textTertiary }]}>
          <Text style={[styles.detailBold, { color: theme.textSecondary }]}>{info.totalArticles}</Text>
          {' '}{t('savedArticlesCount')}
        </Text>
        <Text style={[styles.detailText, { color: theme.textTertiary }]}>
          {t('expiresIn')} <Text style={[styles.detailBold, { color: theme.textSecondary }]}>48h</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  size: {
    fontSize: 11,
  },
  bar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 10,
  },
  detailBold: {
    fontWeight: '600',
  },
});
