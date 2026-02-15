import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../utils/i18n';

export default function OfflineBanner({ isConnected, isSyncing, lastSyncTime }) {
  const { t } = useI18n();

  if (isConnected && !isSyncing) return null;

  const lastSyncLabel = lastSyncTime
    ? `${t('lastSync')} ${Math.round((Date.now() - lastSyncTime) / 60000)} ${t('min')}`
    : t('neverSynced');

  if (!isConnected) {
    return (
      <View style={styles.offlineBanner}>
        <Ionicons name="cloud-offline-outline" size={20} color="#fcd34d" />
        <View style={styles.bannerContent}>
          <Text style={styles.offlineTitle}>{t('offlineMode')}</Text>
          <Text style={styles.offlineText}>
            {t('showingSavedArticles')} • {lastSyncLabel}
          </Text>
        </View>
      </View>
    );
  }

  if (isSyncing) {
    return (
      <View style={styles.syncBanner}>
        <Ionicons name="sync-outline" size={20} color="#6ee7b7" />
        <View style={styles.bannerContent}>
          <Text style={styles.syncTitle}>{t('syncing')}</Text>
          <Text style={styles.syncText}>{t('updatingArticles')}</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.25)',
  },
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
  },
  bannerContent: { flex: 1 },
  offlineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fcd34d',
    marginBottom: 2,
  },
  offlineText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
  },
  syncTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6ee7b7',
    marginBottom: 2,
  },
  syncText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
  },
  progressBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '70%',
    backgroundColor: '#6ee7b7',
    borderRadius: 2,
  },
});
