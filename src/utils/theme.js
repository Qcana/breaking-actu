import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'briefing_theme';

const darkTheme = {
  mode: 'dark',
  bg: '#030810',
  bgGradient: ['#030810', '#091428', '#030810'],
  headerBg: 'rgba(255,255,255,0.08)',
  headerBorder: 'rgba(255,255,255,0.12)',
  cardBg: 'rgba(255,255,255,0.025)',
  cardBorder: [
    'rgba(255,255,255,0.15)',
    'rgba(192,192,192,0.05)',
    'rgba(255,255,255,0.02)',
    'rgba(192,192,192,0.05)',
    'rgba(255,255,255,0.12)',
  ],
  textPrimary: 'rgba(255,255,255,0.93)',
  textSecondary: 'rgba(255,255,255,0.48)',
  textTertiary: 'rgba(255,255,255,0.33)',
  textMuted: 'rgba(255,255,255,0.18)',
  textTitle: '#e2e8f0',
  textSubtitle: 'rgba(255,255,255,0.45)',
  accent: '#a5b4fc',
  chipBg: 'rgba(255,255,255,0.06)',
  chipText: 'rgba(255,255,255,0.4)',
  inputBg: 'rgba(255,255,255,0.06)',
  inputBorder: 'rgba(255,255,255,0.08)',
  inputText: 'rgba(255,255,255,0.8)',
  inputPlaceholder: 'rgba(255,255,255,0.25)',
  buttonBg: 'rgba(255,255,255,0.1)',
  buttonBorder: 'rgba(255,255,255,0.18)',
  buttonText: 'rgba(255,255,255,0.7)',
  footerBorder: 'rgba(255,255,255,0.08)',
  numberBadge: ['#e0e0e0', '#a0a0a0', '#d0d0d0'],
  numberText: '#1e293b',
  navBg: 'rgba(15,15,25,0.95)',
  navBorder: 'rgba(255,255,255,0.08)',
  navInactive: 'rgba(255,255,255,0.35)',
  cacheBg: 'rgba(16,185,129,0.08)',
  cacheBorder: 'rgba(16,185,129,0.15)',
  cacheText: 'rgba(16,185,129,0.7)',
  settingsBg: 'rgba(255,255,255,0.04)',
  settingsBorder: 'rgba(255,255,255,0.06)',
  splashBg: '#030810',
};

const lightTheme = {
  mode: 'light',
  bg: '#eef1f6',
  bgGradient: ['#eef1f6', '#e4e8f0', '#eef1f6'],
  headerBg: 'rgba(235,238,245,0.95)',
  headerBorder: 'rgba(0,0,0,0.06)',
  cardBg: 'rgba(240,243,248,0.95)',
  cardBorder: [
    'rgba(0,0,0,0.05)',
    'rgba(0,0,0,0.02)',
    'rgba(0,0,0,0.01)',
    'rgba(0,0,0,0.02)',
    'rgba(0,0,0,0.05)',
  ],
  textPrimary: '#2d3748',
  textSecondary: '#4a5568',
  textTertiary: '#718096',
  textMuted: 'rgba(0,0,0,0.10)',
  textTitle: '#2d3748',
  textSubtitle: '#718096',
  accent: '#5b5fc7',
  chipBg: 'rgba(91,95,199,0.06)',
  chipText: '#718096',
  inputBg: 'rgba(91,95,199,0.04)',
  inputBorder: 'rgba(0,0,0,0.06)',
  inputText: '#2d3748',
  inputPlaceholder: '#a0aec0',
  buttonBg: 'rgba(91,95,199,0.08)',
  buttonBorder: 'rgba(91,95,199,0.15)',
  buttonText: '#4a5568',
  footerBorder: 'rgba(0,0,0,0.06)',
  numberBadge: ['#5b5fc7', '#6366f1', '#818cf8'],
  numberText: '#ffffff',
  navBg: 'rgba(238,241,246,0.98)',
  navBorder: 'rgba(0,0,0,0.06)',
  navInactive: '#a0aec0',
  cacheBg: 'rgba(16,185,129,0.08)',
  cacheBorder: 'rgba(16,185,129,0.15)',
  cacheText: 'rgba(5,150,105,0.7)',
  settingsBg: 'rgba(91,95,199,0.04)',
  settingsBorder: 'rgba(0,0,0,0.05)',
  splashBg: '#eef1f6',
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved !== null) setIsDark(saved === 'dark');
    });
  }, []);

  const toggleTheme = useCallback(async () => {
    const newMode = !isDark;
    setIsDark(newMode);
    await AsyncStorage.setItem(STORAGE_KEY, newMode ? 'dark' : 'light');
  }, [isDark]);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
