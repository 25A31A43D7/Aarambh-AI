import { Language } from '../types';
import { LANGUAGES } from '../i18n';

export function speakText(text: string, lang: Language): void {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = LANGUAGES[lang]?.speechLocale || 'en-IN';
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

// Explicitly requests microphone access from the browser
export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop media tracks after acquiring authorization
      stream.getTracks().forEach((track) => track.stop());
      return true;
    }
  } catch (err) {
    console.warn('Microphone permission not granted or prompt dismissed:', err);
  }
  return false;
}

// Check for SpeechRecognition support
export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

export function startSpeechRecognition(
  lang: Language,
  onResult: (transcript: string) => void,
  onEnd: () => void,
  onError: (err: unknown) => void
): { stop: () => void } | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition is not supported in this browser. Please use Chrome/Edge.');
      onError(new Error('Speech recognition not supported in this browser.'));
      return null;
    }

    // Try requesting user media permission seamlessly
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).catch((err) => {
        console.warn('Microphone access note:', err);
      });
    }

    const recognition = new SpeechRecognition();
    recognition.lang = LANGUAGES[lang]?.speechLocale || 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      }
    };

    recognition.onerror = (err: unknown) => {
      console.warn('Speech recognition error:', err);
      onError(err);
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      },
    };
  } catch (err) {
    onError(err);
    return null;
  }
}
