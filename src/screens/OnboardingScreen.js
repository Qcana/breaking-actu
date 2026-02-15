import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../utils/theme';
import { useI18n } from '../utils/i18n';
import { lightTap } from '../utils/haptics';

const ONBOARDING_KEY = 'briefing_onboarding_done';

export async function isOnboardingDone() {
  const val = await AsyncStorage.getItem(ONBOARDING_KEY);
  return val === 'true';
}

export default function OnboardingScreen({ onDone }) {
  const { theme } = useTheme();
  const { t } = useI18n();

  const handleStart = async () => {
    lightTap();
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    onDone?.();
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={theme.bgGradient} style={StyleSheet.absoluteFill} />

      <View style={styles.content}>
        <LinearGradient colors={theme.numberBadge} style={styles.logoBg}>
          <Text style={[styles.logoText, { color: theme.numberText }]}>BA</Text>
        </LinearGradient>
        <Text style={[styles.title, { color: theme.textTitle }]}>{t('onboardingWelcome')}</Text>
        <Text style={[styles.desc, { color: theme.textSubtitle }]}>{t('onboardingSubtitle')}</Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonBg, borderColor: theme.buttonBorder }]}
        onPress={handleStart}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, { color: theme.textPrimary }]}>
          {t('onboardingStart')}
        </Text>
        <Ionicons name="checkmark" size={20} color={theme.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoBg: {
    width: 100,
    height: 100,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoText: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 60,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
  },
});
