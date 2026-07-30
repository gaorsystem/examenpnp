// Web Speech API wrapper for Text-To-Speech (Lectura por voz de preguntas)

export function speakText(text: string, onEnd?: () => void, onError?: () => void): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    onError?.();
    return () => {};
  }

  const synth = window.speechSynthesis;

  // Cancel any ongoing speech safely without breaking new speech on iOS/Android
  if (synth.speaking || synth.pending) {
    synth.cancel();
  }

  let isCancelled = false;

  // Small delay so mobile Safari / Chrome Android doesn't immediately abort the speech
  const timeoutId = setTimeout(() => {
    if (isCancelled) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES'; // Universal Spanish fallback across iOS and Android
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const assignVoice = () => {
      const voices = synth.getVoices();
      if (!voices || voices.length === 0) return;
      const esVoice =
        voices.find((v) => v.lang.includes('es-PE')) ||
        voices.find((v) => v.lang.includes('es-MX')) ||
        voices.find((v) => v.lang.includes('es-ES')) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('es'));
      if (esVoice) {
        utterance.voice = esVoice;
      }
    };

    assignVoice();

    // If voices weren't ready on mobile, assign when loaded
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = assignVoice;
    }

    utterance.onend = () => {
      if (!isCancelled) onEnd?.();
    };

    utterance.onerror = (err) => {
      console.warn('Speech synthesis error:', err);
      if (!isCancelled) onError?.();
    };

    try {
      synth.speak(utterance);
    } catch (e) {
      console.error('TTS error:', e);
      if (!isCancelled) onError?.();
    }
  }, 100);

  // Return cancel function
  return () => {
    isCancelled = true;
    clearTimeout(timeoutId);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

