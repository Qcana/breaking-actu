import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

let isSpeaking = false;

export async function speak(text, onStart, onDone) {
  if (isSpeaking) {
    await stop();
    return false; // was stopped
  }

  isSpeaking = true;
  if (onStart) onStart();

  return new Promise((resolve) => {
    Speech.speak(text, {
      language: 'fr-FR',
      pitch: 1.0,
      rate: Platform.OS === 'web' ? 0.9 : 0.95,
      onStart: () => {
        isSpeaking = true;
      },
      onDone: () => {
        isSpeaking = false;
        if (onDone) onDone();
        resolve(true);
      },
      onStopped: () => {
        isSpeaking = false;
        if (onDone) onDone();
        resolve(false);
      },
      onError: () => {
        isSpeaking = false;
        if (onDone) onDone();
        resolve(false);
      },
    });
  });
}

export async function stop() {
  isSpeaking = false;
  await Speech.stop();
}

export function getIsSpeaking() {
  return isSpeaking;
}
