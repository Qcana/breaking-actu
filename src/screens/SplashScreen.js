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
        Animated.timing(titleOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]),
      // Sous-titre
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
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

      {/* Logo diamant */}
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <View style={styles.diamondOuter}>
          <LinearGradient
            colors={['#6366f1', '#818cf8']}
            style={styles.diamondGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.diamondBorder}>
              <Text style={styles.diamondLine1}>BRIEFING</Text>
              <Text style={styles.diamondLine2}>ACTU</Text>
            </View>
          </LinearGradient>
        </View>
      </Animated.View>

      {/* Sous-titre */}
      <Animated.View style={{ opacity: subtitleOpacity }}>
        <Text style={[styles.subtitle, { color: theme.textSubtitle }]}>
          L'essentiel de l'actu, chaque jour
        </Text>
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
    marginBottom: 24,
  },
  diamondOuter: {
    width: 120,
    height: 120,
    transform: [{ rotate: '45deg' }],
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 15,
  },
  diamondGradient: {
    width: 120,
    height: 120,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diamondBorder: {
    width: 112,
    height: 112,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  diamondLine1: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 3,
  },
  diamondLine2: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 5,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    letterSpacing: 0.5,
    marginBottom: 30,
  },
});
