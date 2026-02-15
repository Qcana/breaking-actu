import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VOICE_STORAGE_KEY = 'briefing_voice';

let isSpeaking = false;
let onDoneCallback = null;

export async function getAvailableVoices() {
  try {
    const all = await Speech.getAvailableVoicesAsync();
    // Filtrer les voix françaises
    const frVoices = all.filter(
      (v) => v.language && (v.language.startsWith('fr') || v.language.startsWith('FR'))
    );
    // Formater pour l'UI
    return frVoices.map((v) => ({
      id: v.identifier,
      name: v.name || v.identifier,
      description: v.language,
      gender: v.quality === 'Enhanced' ? 'female' : 'male',
    }));
  } catch {
    return [];
  }
}

export async function loadVoiceSettings() {
  try {
    const raw = await AsyncStorage.getItem(VOICE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { voiceId: null, voiceName: null };
}

export async function saveVoiceSettings(settings) {
  await AsyncStorage.setItem(VOICE_STORAGE_KEY, JSON.stringify(settings));
}

export async function speak(text, onStart, onDone) {
  if (isSpeaking) {
    await stop();
    return false;
  }

  isSpeaking = true;
  onDoneCallback = onDone;
  if (onStart) onStart();

  const voiceSettings = await loadVoiceSettings();

  const options = {
    language: 'fr-FR',
    pitch: 1.0,
    rate: 0.95,
    onDone: () => {
      isSpeaking = false;
      if (onDoneCallback) onDoneCallback();
      onDoneCallback = null;
    },
    onError: () => {
      isSpeaking = false;
      if (onDoneCallback) onDoneCallback();
      onDoneCallback = null;
    },
    onStopped: () => {
      isSpeaking = false;
      if (onDoneCallback) onDoneCallback();
      onDoneCallback = null;
    },
  };

  if (voiceSettings.voiceId) {
    options.voice = voiceSettings.voiceId;
  } else {
    // Auto-sélectionner une voix française si aucune n'est choisie
    try {
      const all = await Speech.getAvailableVoicesAsync();
      const fr = all.find((v) => v.language && v.language.startsWith('fr'));
      if (fr) options.voice = fr.identifier;
    } catch {}
  }

  Speech.speak(text, options);
  return true;
}

export async function speakPreview(text, voiceId) {
  await stop();

  const options = {
    language: 'fr-FR',
    pitch: 1.0,
    rate: 0.95,
  };

  if (voiceId) {
    options.voice = voiceId;
  } else {
    try {
      const all = await Speech.getAvailableVoicesAsync();
      const fr = all.find((v) => v.language && v.language.startsWith('fr'));
      if (fr) options.voice = fr.identifier;
    } catch {}
  }

  Speech.speak(text, options);
}

export async function stop() {
  isSpeaking = false;
  onDoneCallback = null;
  Speech.stop();
}

export function getIsSpeaking() {
  return isSpeaking;
}
