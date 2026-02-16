import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
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

  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.2)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(30)).current;
  const descOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonY = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.sequence([
      // 1. Logo apparaît avec scale + fade
      Animated.parallel([
        Animated.spring(scaleValue, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
        Animated.timing(opacityValue, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      // 2. Rotation 3 tours (1080°)
      Animated.timing(spinValue, {
        toValue: 3,
        duration: 1800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      // 3. Titre + description apparaissent lentement
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]),
      Animated.timing(descOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      // 4. Bouton apparaît
      Animated.parallel([
        Animated.timing(buttonOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(buttonY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 3],
    outputRange: ['45deg', '1125deg'],
  });

  const handleStart = async () => {
    lightTap();
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    onDone?.();
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={theme.bgGradient} style={StyleSheet.absoluteFill} />

      <View style={styles.content}>
        {/* Logo diamant animé */}
        <Animated.View style={[
          styles.diamondContainer,
          {
            opacity: opacityValue,
            transform: [
              { scale: scaleValue },
              { rotate: spin },
            ],
          },
        ]}>
          <LinearGradient
            colors={['#6366f1', '#818cf8']}
            style={styles.diamondGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View style={[styles.diamondBorder, {
              transform: [
                { rotate: spinValue.interpolate({
                  inputRange: [0, 3],
                  outputRange: ['-45deg', '-1125deg'],
                })},
              ],
            }]}>
              <Text style={styles.diamondLine1}>BRIEFING</Text>
              <Text style={styles.diamondLine2}>ACTU</Text>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* Titre */}
        <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleY }] }}>
          <Text style={[styles.title, { color: theme.textTitle }]}>{t('onboardingWelcome')}</Text>
        </Animated.View>

        {/* Description */}
        <Animated.View style={{ opacity: descOpacity }}>
          <Text style={[styles.desc, { color: theme.textSubtitle }]}>{t('onboardingSubtitle')}</Text>
        </Animated.View>
      </View>

      {/* Bouton */}
      <Animated.View style={{ opacity: buttonOpacity, transform: [{ translateY: buttonY }] }}>
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
      </Animated.View>
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
  diamondContainer: {
    width: 140,
    height: 140,
    marginBottom: 40,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 15,
  },
  diamondGradient: {
    width: 140,
    height: 140,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diamondBorder: {
    width: 130,
    height: 130,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diamondLine1: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 3,
  },
  diamondLine2: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 5,
    marginTop: 2,
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
