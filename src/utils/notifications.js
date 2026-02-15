import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'briefing_notif';
const WEB_TIMER_KEY = 'briefing_notif_timer';

let webTimerId = null;

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function requestPermissions() {
  if (Platform.OS === 'web') {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function getNextTriggerMs(hour, minute) {
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target.getTime() - now.getTime();
}

function scheduleWebNotification(hour, minute, lang) {
  if (webTimerId) {
    clearTimeout(webTimerId);
    webTimerId = null;
  }

  const title = 'Briefing Actu';
  const body =
    lang === 'fr'
      ? 'Votre briefing du jour est prêt !'
      : 'Your daily briefing is ready!';

  const delayMs = getNextTriggerMs(hour, minute);

  webTimerId = setTimeout(function fire() {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/assets/icon.png' });
    }
    // Reschedule for the next day
    webTimerId = setTimeout(fire, 24 * 60 * 60 * 1000);
  }, delayMs);
}

export async function scheduleDailyNotification(hour, minute, lang = 'fr') {
  if (Platform.OS === 'web') {
    scheduleWebNotification(hour, minute, lang);
    return;
  }

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
  if (Platform.OS === 'web') {
    if (webTimerId) {
      clearTimeout(webTimerId);
      webTimerId = null;
    }
    return;
  }
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
