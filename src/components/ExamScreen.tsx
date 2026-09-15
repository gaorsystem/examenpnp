import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Shield,
  Bookmark,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Scissors,
  Lightbulb,
  Grid,
  Zap,
} from 'lucide-react';
import { Pregunta, RespuestaUsuario, IntentoExamen } from '../types';
import { getFavoritos, toggleFavorito } from '../lib/srsStorage';
import { esRespuestaCorrecta } from '../data/questionsData';

interface ExamScreenProps {
  modo: 'simulacro' | 'repaso' | 'norma' | 'expres' | 'whatsapp';
  normaFiltro?: string;
  preguntas: Pregunta[];
  tiempoLimiteMinutos?: number;
  onFinishExamen: (intento: IntentoExamen) => void;
  onCancelExamen: () => void;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({
  modo,
  normaFiltro,
  preguntas,
  tiempoLimiteMinutos = 20,
  onFinishExamen,
  onCancelExamen,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [respuestasMap, setRespuestasMap] = useState<
    Record<string, { opcion: string; tiempoSeg: number; esCorrecta?: boolean }>
  >({});
  const [favoritos, setFavoritos] = useState<string[]>(() => getFavoritos());
  const [segundosRestantes, setSegundosRestantes] = useState<number>(() =>
    modo === 'simulacro' || modo === 'expres' ? tiempoLimiteMinutos * 60 : 0
  );
  const [showConfirmFinish, setShowConfirmFinish] = useState<boolean>(false);
  const [modoInstantaneo] = useState<boolean>(modo !== 'simulacro');

  // Lifelines & Interactive tools
  const [eliminatedMap, setEliminatedMap] = useState<Record<string, string[]>>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showJumpDrawer, setShowJumpDrawer] = useState<boolean>(false);
  const [gridFilter, setGridFilter] = useState<'todas' | 'respondidas' | 'pendientes' | 'marcadas'>('todas');

  const startTimeRef = useRef<number>(Date.now());
  const questionStartTimeRef = useRef<number>(Date.now());

  const currentPregunta = preguntas[currentIndex];
  const totalPreguntas = preguntas.length;

  // Timer Countdown for exam modes
  useEffect(() => {
    if (modo !== 'simulacro' && modo !== 'expres') return;

    const interval = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalizarExamen();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [modo]);

  // Reset timer & hint on question change
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    setShowHint(false);
  }, [currentIndex]);

  // Keyboard Navigation Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        showConfirmFinish
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(totalPreguntas - 1, prev + 1));
      } else if (['a', 'b', 'c', 'd', 'e', '1', '2', '3', '4', '5'].includes(e.key.toLowerCase())) {
        const letters = ['a', 'b', 'c', 'd', 'e'];
        const keyIndex = letters.includes(e.key.toLowerCase())
          ? letters.indexOf(e.key.toLowerCase())
          : parseInt(e.key) - 1;

        if (currentPregunta && currentPregunta.opciones[keyIndex]) {
          const choice = currentPregunta.opciones[keyIndex];
          const isEliminated = (eliminatedMap[currentPregunta.id] || []).includes(choice);
          if (!isEliminated) {
            handleSelectOpcion(choice);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentPregunta, totalPreguntas, eliminatedMap, showConfirmFinish]);

  const handleSelectOpcion = (opcionElegida: string) => {
    if (!currentPregunta) return;

    const elapsedSeg = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    const esCorrecta = esRespuestaCorrecta(
      opcionElegida,
      currentPregunta.respuesta,
      currentPregunta.opciones
    );

    setRespuestasMap((prev) => ({
      ...prev,
      [currentPregunta.id]: {
        opcion: opcionElegida,
        tiempoSeg: elapsedSeg,
        esCorrecta,
      },
    }));
  };

  const handleToggleFavorito = () => {
    if (!currentPregunta) return;
    toggleFavorito(currentPregunta.id);
    setFavoritos(getFavoritos());
  };

  const handleUse5050 = () => {
    if (!currentPregunta || eliminatedMap[currentPregunta.id]) return;

    const correctIndex = currentPregunta.opciones.findIndex((op) =>
      esRespuestaCorrecta(op, currentPregunta.respuesta, currentPregunta.opciones)
    );

    const wrongIndices = currentPregunta.opciones
      .map((_, idx) => idx)
      .filter((idx) => idx !== correctIndex);

    const shuffled = [...wrongIndices].sort(() => Math.random() - 0.5);
    const eliminatedIndices = shuffled.slice(0, 2);
    const eliminatedTexts = eliminatedIndices.map((i) => currentPregunta.opciones[i]);

    setEliminatedMap((prev) => ({
      ...prev,
      [currentPregunta.id]: eliminatedTexts,
    }));
  };

  const handleFinalizarExamen = () => {
    const duracionSeg = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

    let aciertos = 0;
    const respuestasList: RespuestaUsuario[] = [];

    preguntas.forEach((q) => {
      const resp = respuestasMap[q.id];
      const opcionElegida = resp ? resp.opcion : '';
      const esCorrecta = resp
        ? esRespuestaCorrecta(opcionElegida, q.respuesta, q.opciones)
        : false;
      if (esCorrecta) aciertos += 1;

      respuestasList.push({
        preguntaId: q.id,
        opcionElegida,
        esCorrecta,
        tiempoRespuestaSeg: resp ? resp.tiempoSeg : 0,
      });
    });

    const intento: IntentoExamen = {
      id: `int_${Date.now()}`,
      modo,
      normaFiltro,
      totalPreguntas,
      aciertos,
      duracionSeg,
      fecha: new Date().toISOString(),
      respuestas: respuestasList,
    };

    onFinishExamen(intento);
  };

  if (!currentPregunta) {
    return (
      <div className="text-center py-12 text-emerald-100 space-y-4">
        <AlertCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-300 mx-auto" />
        <h3 className="font-display text-xl font-bold">No hay preguntas disponibles</h3>
        <p className="text-xs text-emerald-700 dark:text-emerald-200">Selecciona otra materia o regresa al inicio.</p>
        <button
          onClick={onCancelExamen}
          className="bg-white text-[#01241a] px-5 py-2.5 rounded-xl text-xs font-mono font-bold"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  const currentRespuesta = respuestasMap[currentPregunta.id];
  const isRespondida = !!currentRespuesta;
  const isFav = favoritos.includes(currentPregunta.id);
  const currentEliminated = eliminatedMap[currentPregunta.id] || [];

  // Formatting Time
  const mins = Math.floor(segundosRestantes / 60);
  const secs = segundosRestantes % 60;
  const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-16 bg-[#F8FAFC] dark:bg-[#011611] text-slate-900 dark:text-slate-100 p-3 sm:p-6 rounded-3xl min-h-screen transition-colors duration-300">
      {/* Top Control Header - Styled from screenshots */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          type="button"
          onClick={onCancelExamen}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Portal</span>
        </button>

        <div className="flex items-center gap-2">
          {(modo === 'simulacro' || modo === 'expres') && (
            <div className="bg-white dark:bg-[#02281e] border border-slate-200 dark:border-emerald-800/30 px-3 py-1.5 rounded-xl flex items-center gap-2 text-sm font-mono font-bold shadow-sm">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700 dark:text-emerald-300">{timeFormatted}</span>
            </div>
          )}
          
          <button
            onClick={() => setShowJumpDrawer(!showJumpDrawer)}
            className="w-10 h-10 bg-white dark:bg-[#02281e] border border-slate-200 dark:border-emerald-800/30 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 shadow-sm transition-all"
          >
            <Grid className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowConfirmFinish(true)}
            className="bg-[#EF4444] hover:bg-[#DC2626] text-white px-5 py-2 rounded-xl font-display font-black text-xs tracking-wider shadow-md transition-all active-scale"
          >
            FIN
          </button>
        </div>
      </div>

      {/* QUESTION CARD - Tactical HUD Style */}
      <div className="bg-white dark:bg-[#02281e] rounded-[32px] shadow-sm border border-slate-200 dark:border-emerald-800/20 p-5 sm:p-8 relative space-y-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-full"></div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest font-mono">
            {currentPregunta.grupo || 'COMUNES'}
          </span>
          <span className="bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest font-mono border border-slate-200 dark:border-slate-700">
            CÓDIGO: {currentPregunta.id}
          </span>
        </div>

        <div className="space-y-4">
          <h2 className="font-display font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 uppercase tracking-wide leading-tight">
            {currentPregunta.norma}
          </h2>

          <h1 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white leading-tight tracking-tight uppercase">
            {currentPregunta.enunciado}
          </h1>

          <p className="text-[10px] sm:text-xs font-mono font-black text-slate-400 uppercase tracking-[0.2em] pt-2">
            Selecciona una alternativa
          </p>
        </div>

        {/* ALTERNATIVAS - Styled as Buttons in Image */}
        <div className="grid grid-cols-1 gap-3">
          {currentPregunta.opciones.map((opcionText, opIdx) => {
            const letra = String.fromCharCode(65 + opIdx);
            const isSelected = currentRespuesta?.opcion === opcionText;
            const esCorrecta = esRespuestaCorrecta(
              opcionText,
              currentPregunta.respuesta,
              currentPregunta.opciones
            );
            const isEliminated = currentEliminated.includes(opcionText);

            let styleClass = "bg-slate-50 dark:bg-[#003829]/30 border-slate-200 dark:border-emerald-800/20 hover:border-emerald-400 dark:hover:border-emerald-500";
            let badgeClass = "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50";
            let textClass = "text-slate-700 dark:text-slate-200";

            if (isSelected) {
              styleClass = "bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-500 ring-1 ring-emerald-500/20";
              badgeClass = "bg-emerald-500 text-white border-emerald-400";
              textClass = "text-emerald-900 dark:text-white font-bold";
            }

            if (modoInstantaneo && isRespondida) {
              if (esCorrecta) {
                styleClass = "bg-emerald-50 dark:bg-emerald-900/40 border-emerald-500 ring-2 ring-emerald-500/20";
                badgeClass = "bg-emerald-500 text-white border-emerald-500";
              } else if (isSelected) {
                styleClass = "bg-red-50 dark:bg-red-900/20 border-red-500 ring-2 ring-red-500/20";
                badgeClass = "bg-red-500 text-white border-red-500";
                textClass = "text-red-900 dark:text-red-100 font-bold";
              }
            }

            if (isEliminated) {
              styleClass = "opacity-20 pointer-events-none grayscale";
            }

            return (
              <button
                key={opIdx}
                disabled={isEliminated}
                onClick={() => handleSelectOpcion(opcionText)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 group active-scale ${styleClass}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-base shrink-0 border transition-colors ${badgeClass}`}>
                  {letra}
                </div>
                <span className={`flex-1 text-[13px] sm:text-sm leading-snug font-medium transition-colors ${textClass}`}>
                  {opcionText}
                </span>
                {modoInstantaneo && isRespondida && esCorrecta && (
                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                )}
                {modoInstantaneo && isRespondida && isSelected && !esCorrecta && (
                  <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-emerald-800/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 font-display">
              Pregunta {currentIndex + 1} de {totalPreguntas}
            </span>
            <div className="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest font-mono">
              {Math.round(((currentIndex + 1) / totalPreguntas) * 100)}% Avance
            </div>
          </div>
          
          <div className="h-1.5 w-full bg-slate-100 dark:bg-[#003829] rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${((currentIndex + 1) / totalPreguntas) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* FEEDBACK - Styled from screenshot feedback area */}
        {isRespondida && modoInstantaneo && (
          <div className={`mt-4 p-4 rounded-2xl animate-fadeIn border ${
            currentRespuesta.esCorrecta 
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500/20 text-emerald-900 dark:text-emerald-100' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-500/20 text-red-900 dark:text-red-100'
          }`}>
            <div className="flex items-center gap-2 mb-2 font-black text-xs uppercase tracking-wider">
              {currentRespuesta.esCorrecta ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{currentRespuesta.esCorrecta ? '¡Respuesta Correcta!' : 'Respuesta Incorrecta'}</span>
            </div>
            <p className="text-xs font-medium leading-relaxed opacity-90">
              <span className="font-bold">Respuesta Oficial:</span> {currentPregunta.respuesta}
              {currentPregunta.ubicacion && (
                <span className="block mt-1 italic opacity-80">Base Legal: {currentPregunta.ubicacion}</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* JUMP DRAWER - Tactical Grid */}
      {showJumpDrawer && (
        <div className="bg-white dark:bg-[#02281e] border border-slate-200 dark:border-emerald-800/30 rounded-3xl p-5 shadow-2xl animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-emerald-800/10 pb-3">
            <h3 className="font-display font-bold text-base text-slate-800 dark:text-white flex items-center gap-2">
              <Grid className="w-5 h-5 text-emerald-500" />
              Mapa de Preguntas
            </h3>
            <button
              onClick={() => setShowJumpDrawer(false)}
              className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg text-slate-500 hover:text-emerald-600 transition-colors"
            >
              CERRAR
            </button>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-60 overflow-y-auto p-1 scrollbar-none">
            {preguntas.map((q, idx) => {
              const resp = respuestasMap[q.id];
              const isCurrent = idx === currentIndex;
              const isBookmarked = favoritos.includes(q.id);

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowJumpDrawer(false);
                  }}
                  className={`aspect-square rounded-xl font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 active-scale border-2 ${
                    isCurrent
                      ? 'bg-emerald-500 text-white border-emerald-400 scale-105 shadow-md shadow-emerald-500/20'
                      : resp
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                      : 'bg-slate-50 dark:bg-slate-800/30 text-slate-400 border-slate-100 dark:border-slate-800/20 hover:border-emerald-400'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isBookmarked && <Bookmark className="w-2 h-2 fill-current" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* BOTTOM ACTIONS */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-6 py-3 rounded-2xl bg-white dark:bg-[#02281e] border border-slate-200 dark:border-emerald-800/30 text-slate-500 hover:text-emerald-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm font-bold text-sm active-scale flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </button>

        {currentIndex < totalPreguntas - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(totalPreguntas - 1, prev + 1))}
            className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all active-scale flex items-center gap-2"
          >
            Siguiente
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinalizarExamen}
            className="px-8 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-500/20 transition-all active-scale flex items-center gap-2"
          >
            Finalizar
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* CONFIRM FINISH MODAL */}
      {showConfirmFinish && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-emerald-700 dark:bg-[#004d38] border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-300">
              <AlertCircle className="w-8 h-8 shrink-0" />
              <h3 className="font-display font-extrabold text-lg text-white">
                ¿Finalizar examen de prueba?
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-sans">
              Has respondido{' '}
              <strong className="text-white font-bold">
                {Object.keys(respuestasMap).length} de {totalPreguntas}
              </strong>{' '}
              preguntas. Al confirmar, obtendrás tu nota oficial de ascenso y retroalimentación de respuestas.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmFinish(false)}
                className="bg-slate-100 dark:bg-[#003829] hover:bg-emerald-900 text-emerald-700 dark:text-emerald-200 px-5 py-2.5 rounded-xl font-mono text-xs font-bold border border-slate-300 dark:border-emerald-600 active-scale"
              >
                Seguir respondiendo
              </button>
              <button
                onClick={handleFinalizarExamen}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-mono text-xs font-bold shadow-md active-scale"
              >
                Sí, Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
