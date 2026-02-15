import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export function lightTap() {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function mediumTap() {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export function selectionTap() {
  if (Platform.OS === 'web') return;
  Haptics.selectionAsync();
}
