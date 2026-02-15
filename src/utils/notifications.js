import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'briefing_notif';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions() {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyNotification(hour, minute, lang = 'fr') {
  if (Platform.OS === 'web') return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const title = 'Briefing Actu';
  const body =
    lang === 'fr'
      ? 'Votre briefing du jour est prêt !'
      : 'Your daily briefing is ready!';

  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { hour, minute, repeats: true },
  });
}

export async function cancelAllNotifications() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function loadNotificationSettings() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { enabled: false, hour: 8, minute: 0 };
}

export async function saveNotificationSettings(settings) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
