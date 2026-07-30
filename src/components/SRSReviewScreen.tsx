import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Shield,
  Bookmark,
  Sparkles,
  Scissors,
  Lightbulb,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { Pregunta } from '../types';
import { actualizarProgresoSRS, toggleFavorito, getFavoritos } from '../lib/srsStorage';
import { AudioButton } from './AudioButton';

interface SRSReviewScreenProps {
  preguntas: Pregunta[];
  onFinishReview: () => void;
}

export const SRSReviewScreen: React.FC<SRSReviewScreenProps> = ({
  preguntas,
  onFinishReview,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [revisadasCount, setRevisadasCount] = useState<number>(0);
  const [favoritos, setFavoritos] = useState<string[]>(() => getFavoritos());

  // Interactive Lifelines
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);

  const currentPregunta = preguntas[currentIndex];
  const total = preguntas.length;

  if (!currentPregunta) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-8 text-center text-slate-900 dark:text-slate-100 space-y-5 max-w-xl mx-auto my-8 shadow-2xl">
        <Sparkles className="w-14 h-14 text-amber-500 mx-auto animate-bounce" />
        <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white">¡Sesión de Repaso SRS Completada!</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          Has repasado <strong className="text-slate-900 dark:text-white">{revisadasCount} preguntas</strong>. El algoritmo SM-2 ha repogramado la memoria a largo plazo para fortalecer tu rendimiento en el examen oficial.
        </p>
        <button
          onClick={onFinishReview}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black px-8 py-3 rounded-2xl text-sm transition-all shadow-md active-scale border border-amber-400"
        >
          Volver al Menú Principal
        </button>
      </div>
    );
  }

  const esRespondida = opcionSeleccionada !== null;
  const esCorrecta = opcionSeleccionada?.trim() === currentPregunta.respuesta.trim();
  const isFav = favoritos.includes(currentPregunta.id);

  const handleResponder = (opcion: string) => {
    if (esRespondida) return;
    setOpcionSeleccionada(opcion);
  };

  const handleRatingSRS = (calidad: number) => {
    actualizarProgresoSRS(currentPregunta.id, calidad >= 3, calidad);
    setRevisadasCount((prev) => prev + 1);
    setOpcionSeleccionada(null);
    setEliminatedOptions([]);
    setShowHint(false);

    if (currentIndex + 1 < total) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinishReview();
    }
  };

  const handleToggleFav = () => {
    toggleFavorito(currentPregunta.id);
    setFavoritos(getFavoritos());
  };

  const handleUse5050 = () => {
    if (eliminatedOptions.length > 0 || esRespondida) return;
    const correctIndex = currentPregunta.opciones.findIndex(
      (op) => op.trim() === currentPregunta.respuesta.trim()
    );
    const wrongIndices = currentPregunta.opciones
      .map((_, idx) => idx)
      .filter((idx) => idx !== correctIndex);

    const shuffled = [...wrongIndices].sort(() => Math.random() - 0.5);
    const elim = shuffled.slice(0, 2).map((i) => currentPregunta.opciones[i]);
    setEliminatedOptions(elim);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-16">
      {/* Top Header Control */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 text-slate-900 dark:text-slate-100 font-mono text-xs flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-slate-900 dark:text-white text-sm">Repaso Adaptativo SRS (SM-2)</span>
        </div>
        <span className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400 font-bold">
          Pregunta {currentIndex + 1} de {total}
        </span>
      </div>

      {/* QUESTION CARD */}
      <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl relative border border-slate-200 dark:border-slate-700/80 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-4">
          <div className="space-y-1">
            <span
              className={`font-mono text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                currentPregunta.grupo === 'COMUNES'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
              }`}
            >
              Materias {currentPregunta.grupo.toLowerCase()}
            </span>
            <h3 className="font-display font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              {currentPregunta.norma}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <AudioButton
              textToRead={`Pregunta de repaso. ${currentPregunta.norma}. ${currentPregunta.enunciado}. Alternativas: ${currentPregunta.opciones.map((op, i) => `Opción ${String.fromCharCode(65 + i)}: ${op}`).join('. ')}`}
              label="Audio"
              size="sm"
            />
            <button
              onClick={handleToggleFav}
              className={`p-2 rounded-xl border transition-all active-scale ${
                isFav
                  ? 'bg-red-600 text-white border-red-500 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* INTERACTIVE LIFELINES */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 px-2 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            Herramientas Interactivas:
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUse5050}
              disabled={eliminatedOptions.length > 0 || esRespondida}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 border active-scale ${
                eliminatedOptions.length > 0
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 opacity-80'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-amber-400 border-slate-300 dark:border-slate-700 shadow-sm'
              }`}
            >
              <Scissors className="w-3.5 h-3.5 text-amber-500" />
              <span>{eliminatedOptions.length > 0 ? '50:50 Usado' : '50:50 Descarte'}</span>
            </button>

            <button
              onClick={() => setShowHint(!showHint)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 border active-scale ${
                showHint
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHint ? 'Ocultar Pista' : 'Pista Legal'}</span>
            </button>
          </div>
        </div>

        {showHint && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-800 dark:text-slate-200 space-y-1.5 text-xs font-mono animate-fadeIn">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold">
              <Lightbulb className="w-4 h-4 fill-current" />
              <span>Pista de la Norma:</span>
            </div>
            <p className="leading-relaxed">
              {currentPregunta.ubicacion
                ? `Referencia: ${currentPregunta.ubicacion}`
                : 'Pregunta del balotario oficial PNP. Revisa atentamente los términos excluyentes.'}
            </p>
          </div>
        )}

        {/* ENUNCIADO */}
        <p className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-relaxed">
          {currentPregunta.enunciado}
        </p>

        {/* OPTIONS */}
        <div className="space-y-3">
          {currentPregunta.opciones.map((opcion, idx) => {
            const letra = String.fromCharCode(65 + idx);
            const isSelected = opcionSeleccionada === opcion;
            const isRight = opcion.trim() === currentPregunta.respuesta.trim();
            const isEliminated = eliminatedOptions.includes(opcion);

            let style =
              'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700/60 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-sm hover:border-amber-500';

            if (esRespondida) {
              if (isRight) {
                style =
                  'bg-emerald-500/10 dark:bg-emerald-500/20 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold shadow-md';
              } else if (isSelected) {
                style =
                  'bg-red-500/10 dark:bg-red-500/20 border-2 border-red-500 text-red-900 dark:text-red-100 font-bold shadow-md';
              }
            }

            if (isEliminated) {
              style =
                'bg-slate-200 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-600 line-through opacity-40 cursor-not-allowed';
            }

            return (
              <button
                key={idx}
                disabled={esRespondida || isEliminated}
                onClick={() => handleResponder(opcion)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3 text-sm sm:text-base font-sans active-scale ${style}`}
              >
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 border ${
                    esRespondida && isRight
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : esRespondida && isSelected && !isRight
                      ? 'bg-red-500 text-white border-red-400'
                      : 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {letra}
                </span>
                <span className="flex-1 leading-relaxed pt-0.5">{opcion}</span>
                {esRespondida && isRight && (
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 self-center" />
                )}
                {esRespondida && isSelected && !isRight && (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 self-center" />
                )}
              </button>
            );
          })}
        </div>

        {/* ANSWER FEEDBACK & SRS RATING */}
        {esRespondida && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-xs space-y-4 animate-fadeIn border border-slate-200 dark:border-slate-700 shadow-md">
            <div className="flex items-center gap-2 font-bold text-sm">
              {esCorrecta ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" /> ¡Respuesta Correcta!
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" /> Respuesta Incorrecta
                </span>
              )}
            </div>

            <p className="text-slate-800 dark:text-slate-200 leading-relaxed pt-1 border-t border-slate-200 dark:border-slate-700">
              <strong className="text-slate-900 dark:text-white font-bold">Clave Oficial PNP:</strong>{' '}
              <span className="text-amber-600 dark:text-amber-400 font-bold">{currentPregunta.respuesta}</span>
            </p>

            {/* SRS Rating Buttons */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs text-amber-700 dark:text-amber-400 block font-bold">
                ¿Qué tan fácil te resultó esta pregunta? (Ajustar intervalo de memoria):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                <button
                  onClick={() => handleRatingSRS(1)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30 p-2.5 rounded-xl font-bold active-scale shadow-sm"
                >
                  Dificultad Alta
                  <span className="block text-[10px] opacity-75 font-normal">Repaso Hoy</span>
                </button>

                <button
                  onClick={() => handleRatingSRS(3)}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 p-2.5 rounded-xl font-bold active-scale shadow-sm"
                >
                  Media
                  <span className="block text-[10px] opacity-75 font-normal">En 1 día</span>
                </button>

                <button
                  onClick={() => handleRatingSRS(4)}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 p-2.5 rounded-xl font-bold active-scale shadow-sm"
                >
                  Fácil
                  <span className="block text-[10px] opacity-75 font-normal">En 3 días</span>
                </button>

                <button
                  onClick={() => handleRatingSRS(5)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 p-2.5 rounded-xl font-extrabold active-scale shadow-md"
                >
                  Dominada
                  <span className="block text-[10px] opacity-90 font-normal">En 7 días</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
