import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import {
  getSourcesForLanguage,
  loadSelectedSources,
  saveSelectedSources,
} from '../utils/sources';
import {
  requestPermissions,
  scheduleDailyNotification,
  cancelAllNotifications,
  loadNotificationSettings,
  saveNotificationSettings,
} from '../utils/notifications';
import { selectionTap, lightTap } from '../utils/haptics';
import {
  getAvailableVoices,
  loadVoiceSettings,
  saveVoiceSettings,
  speakPreview,
  stop as stopTTS,
} from '../utils/tts';
import CacheInfoBar from '../components/CacheInfoBar';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { lang, t } = useI18n();
  const [selectedSources, setSelectedSources] = useState([]);
  const availableSources = getSourcesForLanguage(lang);

  const [sourcesModalVisible, setSourcesModalVisible] = useState(false);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState(null);
  const [selectedVoiceName, setSelectedVoiceName] = useState(null);
  const contentFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(contentFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [contentFade]);

  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifHour, setNotifHour] = useState(8);
  const [notifMinute, setNotifMinute] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadSelectedSources().then(setSelectedSources);
      loadNotificationSettings().then((s) => {
        setNotifEnabled(s.enabled);
        setNotifHour(s.hour);
        setNotifMinute(s.minute);
      });
      getAvailableVoices().then(setVoices);
      loadVoiceSettings().then((s) => {
        setSelectedVoiceId(s.voiceId);
        setSelectedVoiceName(s.voiceName);
      });
      return () => { stopTTS(); };
    }, [])
  );

  const handleToggleSource = async (sourceId) => {
    let updated;
    if (selectedSources.includes(sourceId)) {
      updated = selectedSources.filter((id) => id !== sourceId);
    } else {
      updated = [...selectedSources, sourceId];
    }
    setSelectedSources(updated);
    await saveSelectedSources(updated);
  };

  const isAllSources = selectedSources.length === 0;

  const handleSelectAll = async () => {
    setSelectedSources([]);
    await saveSelectedSources([]);
  };

  const handleToggleNotif = async (value) => {
    if (value) {
      const granted = await requestPermissions();
      if (!granted) return;
      await scheduleDailyNotification(notifHour, notifMinute, lang);
    } else {
      await cancelAllNotifications();
    }
    setNotifEnabled(value);
    await saveNotificationSettings({ enabled: value, hour: notifHour, minute: notifMinute });
  };

  const handleChangeHour = async (dh) => {
    const h = (notifHour + dh + 24) % 24;
    setNotifHour(h);
    const settings = { enabled: notifEnabled, hour: h, minute: notifMinute };
    await saveNotificationSettings(settings);
    if (notifEnabled) await scheduleDailyNotification(h, notifMinute, lang);
  };

  const handleChangeMinute = async (dm) => {
    const m = (notifMinute + dm + 60) % 60;
    setNotifMinute(m);
    const settings = { enabled: notifEnabled, hour: notifHour, minute: m };
    await saveNotificationSettings(settings);
    if (notifEnabled) await scheduleDailyNotification(notifHour, m, lang);
  };

  const handleSelectVoice = async (voice) => {
    selectionTap();
    setSelectedVoiceId(voice ? voice.id : null);
    setSelectedVoiceName(voice ? voice.name : null);
    await saveVoiceSettings({
      voiceId: voice ? voice.id : null,
      voiceName: voice ? voice.name : null,
    });
  };

  const handlePreviewVoice = (voiceId) => {
    lightTap();
    speakPreview(t('voicePreviewText'), voiceId);
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <LinearGradient colors={theme.bgGradient} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.headerBorder }]}>
        <Text style={[styles.pageTitle, { color: theme.textTitle }]}>{t('settings')}</Text>
      </View>

      <Animated.View style={{ flex: 1, opacity: contentFade }}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* === APPARENCE === */}
        <Text style={[styles.sectionTitle, { color: theme.textSubtitle }]}>{t('appearance')}</Text>
        <View style={[styles.card, { backgroundColor: theme.settingsBg, borderColor: theme.settingsBorder }]}>
          <View style={styles.settingRow}>
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={20}
              color={theme.accent}
            />
            <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>
              {isDark ? t('darkMode') : t('lightMode')}
            </Text>
            <Switch
              value={isDark}
              onValueChange={(v) => { selectionTap(); toggleTheme(v); }}
              trackColor={{ false: 'rgba(0,0,0,0.15)', true: theme.accent + '60' }}
              thumbColor={isDark ? theme.accent : '#f4f3f4'}
            />
          </View>
        </View>

        {/* === NOTIFICATIONS === */}
        <Text style={[styles.sectionTitle, { color: theme.textSubtitle }]}>{t('notifications')}</Text>
        <View style={[styles.card, { backgroundColor: theme.settingsBg, borderColor: theme.settingsBorder }]}>
          <View style={styles.settingRow}>
            <Ionicons name="notifications-outline" size={20} color={theme.accent} />
            <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>
              {t('dailyNotifications')}
            </Text>
            <Switch
              value={notifEnabled}
              onValueChange={(v) => { selectionTap(); handleToggleNotif(v); }}
              trackColor={{ false: 'rgba(0,0,0,0.15)', true: theme.accent + '60' }}
              thumbColor={notifEnabled ? theme.accent : '#f4f3f4'}
            />
          </View>
          {notifEnabled && (
            <>
              <View style={[styles.separator, { backgroundColor: theme.settingsBorder }]} />
              <View style={styles.settingRow}>
                <Ionicons name="time-outline" size={20} color={theme.accent} />
                <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>
                  {t('notifTime')}
                </Text>
                <View style={styles.timePicker}>
                  <TouchableOpacity onPress={() => { lightTap(); handleChangeHour(-1); }} style={styles.timeBtn}>
                    <Ionicons name="remove" size={18} color={theme.textPrimary} />
                  </TouchableOpacity>
                  <Text style={[styles.timeText, { color: theme.textPrimary }]}>
                    {pad(notifHour)}:{pad(notifMinute)}
                  </Text>
                  <TouchableOpacity onPress={() => { lightTap(); handleChangeHour(1); }} style={styles.timeBtn}>
                    <Ionicons name="add" size={18} color={theme.textPrimary} />
                  </TouchableOpacity>
                  <Text style={[styles.timeSep, { color: theme.textMuted }]}>:</Text>
                  <TouchableOpacity onPress={() => { lightTap(); handleChangeMinute(-5); }} style={styles.timeBtn}>
                    <Ionicons name="remove" size={18} color={theme.textPrimary} />
                  </TouchableOpacity>
                  <Text style={[styles.timeText, { color: theme.textPrimary }]}>min</Text>
                  <TouchableOpacity onPress={() => { lightTap(); handleChangeMinute(5); }} style={styles.timeBtn}>
                    <Ionicons name="add" size={18} color={theme.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>

        {/* === VOIX === */}
        <Text style={[styles.sectionTitle, { color: theme.textSubtitle }]}>{t('voice')}</Text>
        <View style={[styles.card, { backgroundColor: theme.settingsBg, borderColor: theme.settingsBorder }]}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setVoiceModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="mic-outline" size={20} color={theme.accent} />
            <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>
              {t('selectVoice')}
            </Text>
            <Text style={[styles.sourceCount, { color: theme.textTertiary }]}>
              {selectedVoiceName || t('defaultVoice')}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Modal voix */}
        <Modal
          visible={voiceModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => { stopTTS(); setVoiceModalVisible(false); }}
        >
          <Pressable style={styles.overlay} onPress={() => { stopTTS(); setVoiceModalVisible(false); }}>
            <Pressable style={[styles.modal, { backgroundColor: theme.bg, borderColor: theme.settingsBorder }]}>
              <Text style={[styles.modalTitle, { color: theme.textTitle }]}>
                {t('selectVoice')}
              </Text>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* Voix par défaut */}
                <TouchableOpacity
                  style={[styles.modalRow, !selectedVoiceId && { backgroundColor: theme.accent + '15' }]}
                  onPress={() => handleSelectVoice(null)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="mic-outline" size={20} color={theme.textPrimary} />
                  <Text style={[styles.modalRowLabel, { color: theme.textPrimary }]}>{t('defaultVoice')}</Text>
                  <TouchableOpacity
                    onPress={() => handlePreviewVoice(null)}
                    style={[styles.timeBtn, { marginRight: 4 }]}
                  >
                    <Ionicons name="play" size={14} color={theme.accent} />
                  </TouchableOpacity>
                  <Ionicons
                    name={!selectedVoiceId ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={!selectedVoiceId ? theme.accent : theme.textMuted}
                  />
                </TouchableOpacity>

                <View style={[styles.separator, { backgroundColor: theme.settingsBorder }]} />

                {voices.length === 0 ? (
                  <View style={[styles.modalRow, { justifyContent: 'center' }]}>
                    <Text style={[styles.modalRowLabel, { color: theme.textTertiary, textAlign: 'center' }]}>
                      {t('noVoicesAvailable')}
                    </Text>
                  </View>
                ) : (
                  voices.map((voice, i) => {
                    const isSelected = selectedVoiceId === voice.id;
                    return (
                      <React.Fragment key={voice.id}>
                        <TouchableOpacity
                          style={[styles.modalRow, isSelected && { backgroundColor: theme.accent + '10' }]}
                          onPress={() => handleSelectVoice(voice)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name={voice.gender === 'female' ? 'woman' : 'man'} size={20} color={theme.textPrimary} />
                          <View style={styles.sourceInfo}>
                            <Text style={[styles.modalRowLabel, { color: theme.textPrimary }]}>{voice.name}</Text>
                            <Text style={[styles.sourceCountry, { color: theme.textTertiary }]}>
                              {voice.description}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => handlePreviewVoice(voice.id)}
                            style={[styles.timeBtn, { marginRight: 4 }]}
                          >
                            <Ionicons name="play" size={14} color={theme.accent} />
                          </TouchableOpacity>
                          <Ionicons
                            name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                            size={20}
                            color={isSelected ? theme.accent : theme.textMuted}
                          />
                        </TouchableOpacity>
                        {i < voices.length - 1 ? (
                          <View style={[styles.separator, { backgroundColor: theme.settingsBorder }]} />
                        ) : null}
                      </React.Fragment>
                    );
                  })
                )}
              </ScrollView>

              <TouchableOpacity
                style={[styles.modalCloseBtn, { backgroundColor: theme.buttonBg, borderColor: theme.buttonBorder }]}
                onPress={() => { stopTTS(); setVoiceModalVisible(false); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalCloseBtnText, { color: theme.textPrimary }]}>{t('done')}</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>

        {/* === SOURCES === */}
        <Text style={[styles.sectionTitle, { color: theme.textSubtitle }]}>{t('newsSources')}</Text>
        <View style={[styles.card, { backgroundColor: theme.settingsBg, borderColor: theme.settingsBorder }]}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setSourcesModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="newspaper-outline" size={20} color={theme.accent} />
            <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>
              {t('selectSources')}
            </Text>
            <Text style={[styles.sourceCount, { color: theme.textTertiary }]}>
              {isAllSources ? t('allSources') : `${selectedSources.length}/${availableSources.length}`}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Modal sources */}
        <Modal
          visible={sourcesModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setSourcesModalVisible(false)}
        >
          <Pressable style={styles.overlay} onPress={() => setSourcesModalVisible(false)}>
            <Pressable style={[styles.modal, { backgroundColor: theme.bg, borderColor: theme.settingsBorder }]}>
              <Text style={[styles.modalTitle, { color: theme.textTitle }]}>
                {t('newsSources')}
              </Text>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* Toutes les sources */}
                <TouchableOpacity
                  style={[styles.modalRow, isAllSources && { backgroundColor: theme.accent + '15' }]}
                  onPress={() => { selectionTap(); handleSelectAll(); }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sourceEmoji}>🌐</Text>
                  <Text style={[styles.modalRowLabel, { color: theme.textPrimary }]}>{t('allSources')}</Text>
                  <Ionicons
                    name={isAllSources ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={isAllSources ? theme.accent : theme.textMuted}
                  />
                </TouchableOpacity>

                <View style={[styles.separator, { backgroundColor: theme.settingsBorder }]} />

                {availableSources.map((source, i) => {
                  const isSelected = selectedSources.includes(source.id);
                  return (
                    <React.Fragment key={source.id}>
                      <TouchableOpacity
                        style={[styles.modalRow, isSelected && { backgroundColor: theme.accent + '10' }]}
                        onPress={() => { selectionTap(); handleToggleSource(source.id); }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.sourceEmoji}>{source.emoji}</Text>
                        <View style={styles.sourceInfo}>
                          <Text style={[styles.modalRowLabel, { color: theme.textPrimary }]}>{source.name}</Text>
                          <Text style={[styles.sourceCountry, { color: theme.textTertiary }]}>
                            {source.country.toUpperCase()}
                          </Text>
                        </View>
                        <Ionicons
                          name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                          size={20}
                          color={isSelected ? theme.accent : theme.textMuted}
                        />
                      </TouchableOpacity>
                      {i < availableSources.length - 1 ? (
                        <View style={[styles.separator, { backgroundColor: theme.settingsBorder }]} />
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </ScrollView>

              <TouchableOpacity
                style={[styles.modalCloseBtn, { backgroundColor: theme.buttonBg, borderColor: theme.buttonBorder }]}
                onPress={() => setSourcesModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalCloseBtnText, { color: theme.textPrimary }]}>{t('done')}</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>

        {/* === STOCKAGE === */}
        <Text style={[styles.sectionTitle, { color: theme.textSubtitle }]}>{t('localStorageTitle')}</Text>
        <CacheInfoBar />

        {/* Version */}
        <Text style={[styles.versionText, { color: theme.textMuted }]}>
          {t('version')} 1.0.0
        </Text>
      </ScrollView>
      </Animated.View>
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
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  sectionHint: {
    fontSize: 12,
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },

  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  sourceEmoji: { fontSize: 18 },
  sourceInfo: { flex: 1 },
  sourceCountry: { fontSize: 11, marginTop: 1 },

  separator: { height: 1, marginHorizontal: 14 },

  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(128,128,128,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 15,
    fontWeight: '600',
    minWidth: 28,
    textAlign: 'center',
  },
  timeSep: {
    fontSize: 12,
    marginHorizontal: 2,
  },

  sourceCount: {
    fontSize: 12,
    marginRight: 4,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 10,
  },
  modalRowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  modalCloseBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },

  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 24,
  },
});
