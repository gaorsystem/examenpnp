// Web Speech API wrapper for Text-To-Speech (Lectura por voz de preguntas)

export function speakText(text: string, onEnd?: () => void, onError?: () => void): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    onError?.();
    return () => {};
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-PE'; // Spanish (Peru) or generic Spanish 'es-ES' / 'es-MX'
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // Try to find a Spanish voice
  const voices = window.speechSynthesis.getVoices();
  const esVoice = voices.find(
    (v) => v.lang.includes('es-PE') || v.lang.includes('es-MX') || v.lang.includes('es-ES') || v.lang.startsWith('es')
  );
  if (esVoice) {
    utterance.voice = esVoice;
  }

  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  window.speechSynthesis.speak(utterance);

  // Return cancel function
  return () => {
    window.speechSynthesis.cancel();
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
