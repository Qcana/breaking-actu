import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../utils/theme';

export default function AnimatedSplash({ onFinish }) {
  const { theme } = useTheme();
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const globalOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo apparaît
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      // Titre slide up
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      // Sous-titre
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      // Pause
      Animated.delay(600),
      // Fade out
      Animated.timing(globalOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      onFinish?.();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: globalOpacity }]}>
      <LinearGradient
        colors={theme.bgGradient}
        style={StyleSheet.absoluteFill}
      />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <LinearGradient
          colors={theme.numberBadge}
          style={styles.logoBg}
        >
          <Text style={[styles.logoText, { color: theme.numberText }]}>BA</Text>
        </LinearGradient>
      </Animated.View>

      {/* Titre */}
      <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleY }] }}>
        <Text style={[styles.title, { color: theme.textTitle }]}>Briefing Actu</Text>
      </Animated.View>

      {/* Sous-titre */}
      <Animated.View style={{ opacity: subtitleOpacity }}>
        <Text style={[styles.subtitle, { color: theme.textSubtitle }]}>
          L'essentiel de l'actu, chaque jour
        </Text>
      </Animated.View>

      {/* Dots de chargement */}
      <Animated.View style={[styles.dotsRow, { opacity: subtitleOpacity }]}>
        <View style={[styles.dot, { backgroundColor: theme.accent }]} />
        <View style={[styles.dot, { backgroundColor: theme.accent, opacity: 0.5 }]} />
        <View style={[styles.dot, { backgroundColor: theme.accent, opacity: 0.25 }]} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  logoText: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    letterSpacing: 0.5,
    marginBottom: 30,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
