import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Square } from 'lucide-react';
import { speakText, stopSpeech, isSpeechSupported } from '../lib/ttsHelper';

interface AudioButtonProps {
  textToRead: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  textToRead,
  label = 'Escuchar Pregunta',
  className = '',
  size = 'md',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(isSpeechSupported());
  }, []);

  useEffect(() => {
    // Stop speech if component unmounts
    return () => {
      stopSpeech();
    };
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakText(
        textToRead,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
    }
  };

  if (!supported) return null;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-1 text-[11px] gap-1'
      : size === 'lg'
      ? 'px-4 py-2.5 text-sm gap-2'
      : 'px-3 py-1.5 text-xs gap-1.5';

  return (
    <button
      onClick={handleToggle}
      type="button"
      title={isPlaying ? 'Detener lectura' : 'Escuchar en voz alta'}
      className={`rounded-full font-mono font-bold transition-all active-scale flex items-center justify-center shrink-0 border ${
        isPlaying
          ? 'bg-[#D4AF37] text-[#122119] border-amber-200 shadow-xl ring-2 ring-amber-400/60'
          : 'bg-[#0d1712] text-[#D4AF37] border-[#D4AF37]/40 hover:bg-[#A6822E] hover:text-[#122119]'
      } ${sizeClasses} ${className}`}
    >
      {isPlaying ? (
        <>
          <div className="flex items-center gap-0.5 h-3 px-0.5">
            <span className="w-0.5 bg-[#122119] rounded-full animate-wave-1"></span>
            <span className="w-0.5 bg-[#122119] rounded-full animate-wave-2"></span>
            <span className="w-0.5 bg-[#122119] rounded-full animate-wave-3"></span>
          </div>
          <span>Leyendo...</span>
          <Square className="w-3 h-3 fill-current ml-1" />
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-[#D4AF37] group-hover:text-current" />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
