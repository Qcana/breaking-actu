import AsyncStorage from '@react-native-async-storage/async-storage';
import { PROXY_URL, proxyFetch } from '../constants';

const VOICE_STORAGE_KEY = 'briefing_voice';

let isSpeaking = false;
let currentAudio = null;

export async function getAvailableVoices() {
  try {
    const response = await proxyFetch(`${PROXY_URL}/tts/voices`);
    const data = await response.json();
    return data.voices || [];
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
  if (onStart) onStart();

  const voiceSettings = await loadVoiceSettings();

  try {
    const response = await proxyFetch(`${PROXY_URL}/tts/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voiceId: voiceSettings.voiceId || undefined,
      }),
    });

    if (!response.ok) {
      throw new Error('TTS request failed');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    currentAudio = new Audio(url);

    currentAudio.onended = () => {
      isSpeaking = false;
      URL.revokeObjectURL(url);
      currentAudio = null;
      if (onDone) onDone();
    };

    currentAudio.onerror = () => {
      isSpeaking = false;
      URL.revokeObjectURL(url);
      currentAudio = null;
      if (onDone) onDone();
    };

    await currentAudio.play();
    return true;
  } catch (err) {
    isSpeaking = false;
    currentAudio = null;
    if (onDone) onDone();
    return false;
  }
}

export async function speakPreview(text, voiceId) {
  await stop();

  try {
    const response = await proxyFetch(`${PROXY_URL}/tts/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceId }),
    });

    if (!response.ok) return;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    currentAudio = new Audio(url);
    currentAudio.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
    };
    await currentAudio.play();
  } catch {}
}

export async function stop() {
  isSpeaking = false;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export function getIsSpeaking() {
  return isSpeaking;
}
