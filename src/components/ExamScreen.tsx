import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Pause,
  Play,
  RotateCcw,
  Trash2,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { Pregunta, RespuestaUsuario, IntentoExamen } from '../types';
import { getFavoritos, toggleFavorito, actualizarProgresoSRS } from '../lib/srsStorage';
import { esRespuestaCorrecta } from '../data/questionsData';
import {
  getActiveExamSession,
  saveActiveExamSession,
  clearActiveExamSession,
  ActiveExamSession,
} from '../lib/activeExamStorage';

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
  // Detect if there is a matching saved session in localStorage to restore
  const initialSession = useMemo(() => {
    const saved = getActiveExamSession();
    if (!saved || !saved.preguntas || saved.preguntas.length === 0) return null;
    // Check if it corresponds to this exam
    if (
      saved.preguntas.length === preguntas.length &&
      saved.preguntas[0]?.id === preguntas[0]?.id
    ) {
      return saved;
    }
    return null;
  }, [preguntas]);

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    return initialSession ? Math.min(initialSession.currentIndex, preguntas.length - 1) : 0;
  });
  const [respuestasMap, setRespuestasMap] = useState<
    Record<string, { opcion: string; tiempoSeg: number; esCorrecta?: boolean }>
  >(() => {
    return initialSession ? initialSession.respuestasMap || {} : {};
  });
  const [favoritos, setFavoritos] = useState<string[]>(() => getFavoritos());
  const [segundosRestantes, setSegundosRestantes] = useState<number>(() => {
    if (initialSession && typeof initialSession.segundosRestantes === 'number') {
      return initialSession.segundosRestantes;
    }
    return modo === 'simulacro' || modo === 'expres' ? tiempoLimiteMinutos * 60 : 0;
  });
  const [showConfirmFinish, setShowConfirmFinish] = useState<boolean>(false);
  const [showPauseModal, setShowPauseModal] = useState<boolean>(false);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState<boolean>(false);
  // Feedback instantáneo: activado por defecto en repaso/normas y conmutable libremente por cualquier usuario
  const [modoInstantaneo, setModoInstantaneo] = useState<boolean>(() => {
    return modo !== 'simulacro';
  });
  const [showRestoredBadge, setShowRestoredBadge] = useState<boolean>(() => !!initialSession);

  // Lifelines & Interactive tools
  const [eliminatedMap, setEliminatedMap] = useState<Record<string, string[]>>(() => {
    return initialSession ? initialSession.eliminatedMap || {} : {};
  });
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showJumpDrawer, setShowJumpDrawer] = useState<boolean>(false);
  const [gridFilter, setGridFilter] = useState<'todas' | 'respondidas' | 'pendientes' | 'marcadas'>('todas');

  const startTimeRef = useRef<number>(Date.now());
  const questionStartTimeRef = useRef<number>(Date.now());

  // Refs for tracking up-to-date state in intervals and beforeunload
  const currentIndexRef = useRef(currentIndex);
  const respuestasMapRef = useRef(respuestasMap);
  const segundosRestantesRef = useRef(segundosRestantes);
  const eliminatedMapRef = useRef(eliminatedMap);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    respuestasMapRef.current = respuestasMap;
  }, [respuestasMap]);

  useEffect(() => {
    segundosRestantesRef.current = segundosRestantes;
  }, [segundosRestantes]);

  useEffect(() => {
    eliminatedMapRef.current = eliminatedMap;
  }, [eliminatedMap]);

  // Helper to persist current state
  const persistSession = (status: 'in_progress' | 'paused' = 'in_progress') => {
    if (preguntas.length === 0) return;
    const session: ActiveExamSession = {
      id: initialSession?.id || `session_${Date.now()}`,
      modo,
      normaFiltro,
      preguntas,
      tiempoLimiteMinutos,
      segundosRestantes: segundosRestantesRef.current,
      currentIndex: currentIndexRef.current,
      respuestasMap: respuestasMapRef.current,
      eliminatedMap: eliminatedMapRef.current,
      status,
      savedAt: Date.now(),
      tituloExamen: normaFiltro || `Simulacro (${preguntas.length} Preguntas)`,
    };
    saveActiveExamSession(session);
  };

  // Auto-save on reload (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      persistSession('in_progress');
      // Standard browser confirmation prompt if leaving
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [modo, normaFiltro, preguntas, tiempoLimiteMinutos]);

  // Persist session whenever answers, index or lifelines change
  useEffect(() => {
    persistSession('in_progress');
  }, [currentIndex, respuestasMap, eliminatedMap]);

  // Periodic auto-save for the timer (every 5 seconds)
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (!showPauseModal && !showConfirmFinish) {
        persistSession('in_progress');
      }
    }, 5000);
    return () => clearInterval(saveInterval);
  }, [showPauseModal, showConfirmFinish]);

  // Hide the "restored" banner after 4 seconds
  useEffect(() => {
    if (showRestoredBadge) {
      const t = setTimeout(() => setShowRestoredBadge(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showRestoredBadge]);

  const currentPregunta = preguntas[currentIndex];
  const totalPreguntas = preguntas.length;

  // Timer Countdown for exam modes (pauses if modal is open)
  useEffect(() => {
    if (modo !== 'simulacro' && modo !== 'expres') return;
    if (showPauseModal || showConfirmFinish) return; // Pause countdown while modal is open

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
  }, [modo, showPauseModal, showConfirmFinish]);

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
        showConfirmFinish ||
        showPauseModal
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
  }, [currentIndex, currentPregunta, totalPreguntas, eliminatedMap, showConfirmFinish, showPauseModal]);

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

    // En modo repaso o refuerzo inteligente, actualizar SRS en tiempo real
    if (modo === 'repaso') {
      actualizarProgresoSRS(currentPregunta.id, esCorrecta);
    }
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

  const handlePausarYSalir = () => {
    persistSession('paused');
    setShowPauseModal(false);
    onCancelExamen();
  };

  const handleDescartarExamen = () => {
    clearActiveExamSession();
    setShowPauseModal(false);
    setShowConfirmDiscard(false);
    onCancelExamen();
  };

  const handleFinalizarExamen = () => {
    clearActiveExamSession(); // Clear active session upon final submission
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
      {/* Restored Session Notification */}
      {showRestoredBadge && (
        <div className="bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 px-4 py-2.5 rounded-2xl text-xs flex items-center justify-between gap-3 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>¡Examen Reanudado!</strong> Continúas en la pregunta {currentIndex + 1} de {totalPreguntas} con tus respuestas y tiempo restante intactos.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowRestoredBadge(false)}
            className="text-emerald-400 hover:text-white px-2 py-0.5 rounded text-xs font-mono font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Control Header - Styled from screenshots */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          type="button"
          onClick={() => setShowPauseModal(true)}
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

          {/* Toggle Modo Estudio / Feedback Inmediato */}
          <button
            type="button"
            onClick={() => setModoInstantaneo(!modoInstantaneo)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold shadow-sm transition-all active:scale-95 ${
              modoInstantaneo
                ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-[#02281e] border-slate-200 dark:border-emerald-800/30 text-slate-500 dark:text-slate-400 hover:text-emerald-500'
            }`}
            title={modoInstantaneo ? "Feedback instantáneo activo: muestra respuesta correcta de inmediato" : "Activar feedback instantáneo con respuesta correcta"}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{modoInstantaneo ? 'Repaso Activo' : 'Ver Respuestas'}</span>
          </button>

          {/* Pause Button */}
          <button
            type="button"
            onClick={() => setShowPauseModal(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-emerald-800/30 bg-white dark:bg-[#02281e] text-slate-600 dark:text-emerald-300 hover:text-emerald-500 flex items-center gap-1.5 text-xs font-bold shadow-sm transition-all active:scale-95"
            title="Pausar simulacro y guardar progreso"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Pausar</span>
          </button>
          
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

        {/* FEEDBACK - Modo Estudio y Refuerzo Táctico */}
        {isRespondida && modoInstantaneo && (
          <div className={`mt-5 p-5 rounded-2xl animate-fadeIn border-2 shadow-sm ${
            currentRespuesta.esCorrecta 
              ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-950 dark:text-emerald-100' 
              : 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-500/40 text-rose-950 dark:text-rose-100'
          }`}>
            <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-current/10">
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider">
                {currentRespuesta.esCorrecta ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-800 dark:text-emerald-300">¡Respuesta Correcta!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <span className="text-rose-800 dark:text-rose-300">Respuesta Incorrecta — Refuerzo Activo</span>
                  </>
                )}
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                currentRespuesta.esCorrecta
                  ? 'bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-200/70 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200'
              }`}>
                {modo === 'repaso' ? 'Refuerzo SRS' : 'Modo Estudio'}
              </span>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="bg-white/80 dark:bg-[#01221a] p-3 rounded-xl border border-slate-200/80 dark:border-emerald-800/40">
                <span className="font-mono font-bold text-[11px] text-slate-500 dark:text-emerald-300/80 uppercase block mb-1">
                  Respuesta Oficial del Balotario:
                </span>
                <p className="font-sans font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentPregunta.respuesta}
                </p>
              </div>

              {currentPregunta.ubicacion && (
                <div className="bg-emerald-100/50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-300/60 dark:border-emerald-700/40 text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono font-black text-[10px] uppercase tracking-wider block text-emerald-700 dark:text-emerald-400">
                      Fundamento Legal:
                    </span>
                    <span className="font-medium text-xs text-slate-800 dark:text-emerald-100">
                      {currentPregunta.ubicacion} ({currentPregunta.norma})
                    </span>
                  </div>
                </div>
              )}

              {modo === 'repaso' && (
                <p className="text-[11px] text-slate-600 dark:text-emerald-300/80 italic pt-1">
                  {currentRespuesta.esCorrecta
                    ? '✓ Has respondido correctamente esta pregunta. Sigue acumulando aciertos para consolidarla como dominada al 100%.'
                    : '⚠ Pregunta mantenida en tu Banco de Errores para garantizar que la domines en próximas revisiones.'}
                </p>
              )}
            </div>
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

      {/* PAUSE & EXIT MODAL */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#011a14] border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white space-y-5 shadow-2xl relative overflow-hidden">
            {/* Ambient blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center">
                  <Pause className="w-5 h-5 fill-current text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Pausar o Salir del Examen
                  </h3>
                  <p className="text-[11px] font-mono text-emerald-400/80 uppercase">
                    Autoguardado Seguro
                  </p>
                </div>
              </div>

              {/* Status card */}
              <div className="bg-[#01251d] border border-emerald-800/40 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Progreso:</span>
                  <strong className="text-white font-mono">
                    {Object.keys(respuestasMap).length} de {totalPreguntas} respondidas
                  </strong>
                </div>
                {segundosRestantes > 0 && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Tiempo restante:</span>
                    <strong className="text-amber-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {timeFormatted}
                    </strong>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-300">
                  <span>Pregunta actual:</span>
                  <strong className="text-emerald-400 font-mono">
                    Pregunta {currentIndex + 1}
                  </strong>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Si sales, tu simulacro se guardará y podrás <strong className="text-emerald-300">reanudarlo exactamente donde te quedaste</strong> desde el portal de inicio.
              </p>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handlePausarYSalir}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausar y Salir al Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPauseModal(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-bold text-xs transition-all active:scale-95"
                >
                  Continuar respondiendo ahora
                </button>

                {/* Discard section */}
                <div className="pt-2 border-t border-emerald-950">
                  {!showConfirmDiscard ? (
                    <button
                      type="button"
                      onClick={() => setShowConfirmDiscard(true)}
                      className="w-full text-center text-[11px] text-red-400/80 hover:text-red-300 hover:underline py-1 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Descartar examen y borrar progreso</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl space-y-2 text-center">
                      <p className="text-[11px] text-red-200">
                        ¿Estás seguro? Se borrarán todas las respuestas marcadas de este intento.
                      </p>
                      <div className="flex gap-2 justify-center">
                        <button
                          type="button"
                          onClick={handleDescartarExamen}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
                        >
                          Sí, Descartar
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowConfirmDiscard(false)}
                          className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
