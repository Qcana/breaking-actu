import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { ThemeProvider, useTheme } from './src/utils/theme';
import { I18nProvider, useI18n } from './src/utils/i18n';
import ErrorBoundary from './src/components/ErrorBoundary';

import BriefingScreen from './src/screens/BriefingScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ArticleDetailScreen from './src/screens/ArticleDetailScreen';
import AnimatedSplash from './src/screens/SplashScreen';
import OnboardingScreen, { isOnboardingDone } from './src/screens/OnboardingScreen';
import { requestPermissions } from './src/utils/notifications';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function NewsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NewsHome" component={BriefingScreen} />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoryHome" component={HistoryScreen} />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}

function AppInner() {
  const { theme, isDark } = useTheme();
  const { t } = useI18n();
  const [splashDone, setSplashDone] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(null);

  useEffect(() => {
    requestPermissions();
    isOnboardingDone().then(setOnboardingDone);
  }, []);

  const navTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.accent,
      background: theme.bg,
      card: theme.navBg,
      text: theme.textPrimary,
      border: theme.navBorder,
      notification: theme.accent,
    },
  };

  if (onboardingDone === false) {
    return (
      <SafeAreaProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <OnboardingScreen onDone={() => setOnboardingDone(true)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer theme={navTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Briefing') {
                iconName = focused ? 'today' : 'today-outline';
              } else if (route.name === 'News') {
                iconName = focused ? 'newspaper' : 'newspaper-outline';
              } else if (route.name === 'History') {
                iconName = focused ? 'time' : 'time-outline';
              } else {
                iconName = focused ? 'settings' : 'settings-outline';
              }
              return <Ionicons name={iconName} size={22} color={color} />;
            },
            tabBarActiveTintColor: theme.accent,
            tabBarInactiveTintColor: theme.navInactive,
            tabBarStyle: {
              backgroundColor: theme.navBg,
              borderTopColor: theme.navBorder,
              borderTopWidth: 1,
              paddingBottom: 8,
              paddingTop: 6,
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '600',
              letterSpacing: 0.3,
            },
          })}
        >
          <Tab.Screen
            name="Briefing"
            component={SummaryScreen}
            options={{ tabBarLabel: t('tabBriefing') }}
          />
          <Tab.Screen
            name="News"
            component={NewsStack}
            options={{ tabBarLabel: t('tabNews') }}
          />
          <Tab.Screen
            name="History"
            component={HistoryStack}
            options={{ tabBarLabel: t('tabHistory') }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ tabBarLabel: t('tabSettings') }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      {!splashDone && <AnimatedSplash onFinish={() => setSplashDone(true)} />}
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <I18nProvider>
          <AppInner />
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
