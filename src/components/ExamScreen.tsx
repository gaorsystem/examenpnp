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
  HelpCircle,
  FileText,
  Volume2,
  Sparkles,
  Scissors,
  Lightbulb,
  Grid,
  Zap,
  Eye,
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
  const [modoInstantaneo, setModoInstantaneo] = useState<boolean>(
    modo !== 'simulacro'
  );

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

    // Shuffle & take 2
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
      <div className="text-center py-12 text-[#F4EFE0] space-y-4">
        <AlertCircle className="w-12 h-12 text-[#D4AF37] mx-auto" />
        <h3 className="font-display text-xl font-bold">No hay preguntas disponibles</h3>
        <p className="text-xs text-[#C9B896]">Selecciona otra materia o regresa al inicio.</p>
        <button
          onClick={onCancelExamen}
          className="bg-[#D4AF37] text-[#122119] px-5 py-2.5 rounded-xl text-xs font-mono font-bold"
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
    <div className="max-w-4xl mx-auto space-y-4 pb-16">
      {/* Top Control Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-2.5 sm:p-3 text-slate-900 dark:text-slate-100 font-mono text-[10px] sm:text-xs flex items-center justify-between gap-2 shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          {/* BOTÓN VISIBLE Y DESTACADO: VOLVER AL PORTAL */}
          <button
            type="button"
            onClick={onCancelExamen}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 font-display font-extrabold text-xs flex items-center gap-2 border border-slate-700 dark:border-slate-200 shadow-md transition-all active-scale shrink-0"
            title="Volver al Portal de preparación"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400 dark:text-amber-600 shrink-0 stroke-[2.5]" />
            <span className="font-sans">Volver al Portal</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold">
            <span className="text-amber-600">{currentIndex + 1}</span>
            <span className="opacity-40">/</span>
            <span>{totalPreguntas}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {modo === 'simulacro' || modo === 'expres' ? (
            <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-2 rounded-xl border border-amber-500/40 text-amber-700 dark:text-amber-400 font-black">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeFormatted}</span>
            </div>
          ) : (
            <span className="hidden xs:inline bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-2 rounded-xl font-bold uppercase text-[10px]">
              {modo.toUpperCase()}
            </span>
          )}

          <button
            onClick={() => setShowJumpDrawer(!showJumpDrawer)}
            className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-amber-400 border border-slate-200 dark:border-slate-700 p-2 rounded-xl active-scale"
            title="Ver mapa de preguntas"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowConfirmFinish(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl font-black shadow-sm active-scale text-[10px]"
          >
            FIN
          </button>
        </div>
      </div>

      {/* Progress Bar with Metallic Gold Fill */}
      <div className="w-full bg-slate-200 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700 shadow-inner">
        <div
          className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / totalPreguntas) * 100}%` }}
        ></div>
      </div>

      {/* EXPEDIENTE POLICIAL QUESTION CARD */}
      <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 relative border border-slate-200 dark:border-slate-700/80 overflow-hidden space-y-4">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>

        {/* Official PNP Stamp Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  currentPregunta.grupo === 'COMUNES'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                }`}
              >
                {currentPregunta.grupo.toLowerCase()}
              </span>
              <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                CÓDIGO: {currentPregunta.id}
              </span>
            </div>

            <h2 className="font-display font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              {currentPregunta.norma}
            </h2>
          </div>
        </div>

        {/* INTERACTIVE LIFELINES & STUDY TOOLS BAR (COMODINES) */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 bg-slate-100 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 px-1 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Herramientas:
          </span>

          <div className="flex items-center gap-1.5">
            {/* 50:50 Lifeline Button */}
            <button
              onClick={handleUse5050}
              disabled={currentEliminated.length > 0 || isRespondida}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1 border active-scale ${
                currentEliminated.length > 0
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 opacity-80'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-amber-400 border-slate-300 dark:border-slate-700 shadow-sm'
              }`}
              title="Descartar 2 alternativas incorrectas"
            >
              <Scissors className="w-3 h-3 text-amber-500" />
              <span>{currentEliminated.length > 0 ? '50:50 Usado' : '50:50'}</span>
            </button>

            {/* Hint Toggle Button */}
            <button
              onClick={() => setShowHint(!showHint)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1 border active-scale ${
                showHint
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              }`}
              title="Ver pista o referencia de ley"
            >
              <Lightbulb className="w-3 h-3" />
              <span>{showHint ? 'Ocultar Pista' : 'Pista'}</span>
            </button>

            {/* Bookmark Question Button */}
            <button
              onClick={handleToggleFavorito}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1 border active-scale ${
                isFav
                  ? 'bg-red-600 text-white border-red-500 shadow-sm'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              }`}
              title="Guardar en lista de repaso prioritario SRS"
            >
              <Bookmark className={`w-3 h-3 ${isFav ? 'fill-current' : ''}`} />
              <span>{isFav ? 'Guardada' : 'Marcar'}</span>
            </button>
          </div>
        </div>

        {/* HINT FLOATING DRAWER */}
        {showHint && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-slate-800 dark:text-slate-200 space-y-1 text-xs font-mono animate-fadeIn">
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold">
              <Lightbulb className="w-3.5 h-3.5 fill-current" />
              <span>Referencia Legal:</span>
            </div>
            <p className="leading-relaxed">
              {currentPregunta.ubicacion
                ? `Esta pregunta corresponde a: ${currentPregunta.ubicacion}. Analiza la redacción del texto legal.`
                : 'Pregunta del temario oficial PNP 2026. Distingue los plazos y causales taxativas.'}
            </p>
          </div>
        )}

        {/* ENUNCIADO DE LA PREGUNTA */}
        <div className="space-y-2">
          <p className="font-display font-black text-base sm:text-xl md:text-2xl text-slate-900 dark:text-white leading-snug tracking-tight">
            {currentPregunta.enunciado}
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-extrabold">
              Selecciona una alternativa:
            </span>
            {modo !== 'simulacro' && (
              <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                RESPUESTA AL INSTANTE ACTIVADA
              </span>
            )}
          </div>
        </div>

        {/* ALTERNATIVAS INTERACTIVAS (OPTION CARDS) */}
        <div className="grid grid-cols-1 gap-2 pt-1">
          {currentPregunta.opciones.map((opcionText, opIdx) => {
            const letra = String.fromCharCode(65 + opIdx); // A, B, C, D, E
            const isSelected = currentRespuesta?.opcion === opcionText;
            const esCorrecta = esRespuestaCorrecta(
              opcionText,
              currentPregunta.respuesta,
              currentPregunta.opciones
            );
            const isEliminated = currentEliminated.includes(opcionText);

            let optionStyle =
              'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-amber-400';

            if (isSelected) {
              optionStyle =
                'bg-amber-500/20 dark:bg-amber-500/30 border-2 border-amber-500 text-slate-900 dark:text-white font-extrabold ring-2 ring-amber-500/40 shadow-sm';
            }

            if (modoInstantaneo && isRespondida) {
              if (esCorrecta) {
                optionStyle =
                  'bg-emerald-500/20 dark:bg-emerald-500/30 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-extrabold ring-2 ring-emerald-500/40 shadow-sm';
              } else if (isSelected) {
                optionStyle =
                  'bg-red-500/20 dark:bg-red-500/30 border-2 border-red-500 text-red-950 dark:text-red-100 font-extrabold ring-2 ring-red-500/40 shadow-sm';
              }
            }

            if (isEliminated) {
              optionStyle =
                'bg-slate-200 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-600 line-through opacity-30 cursor-not-allowed';
            }

            return (
              <button
                key={opIdx}
                disabled={isEliminated}
                onClick={() => handleSelectOpcion(opcionText)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3 text-xs sm:text-sm font-sans active-scale ${optionStyle}`}
              >
                {/* Letter Pill */}
                <span
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs sm:text-sm shrink-0 mt-0.5 border shadow-sm transition-all ${
                    modoInstantaneo && isRespondida && esCorrecta
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-md scale-105'
                      : modoInstantaneo && isRespondida && isSelected && !esCorrecta
                      ? 'bg-red-500 text-white border-red-400 shadow-md scale-105'
                      : isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md scale-105'
                      : 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {letra}
                </span>

                {/* Text Content */}
                <span className="flex-1 leading-snug pt-0.5">{opcionText}</span>

                {/* Instant Feedback Symbols */}
                {modoInstantaneo && isRespondida && esCorrecta && (
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 self-center" />
                )}
                {modoInstantaneo && isRespondida && isSelected && !esCorrecta && (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 self-center" />
                )}
              </button>
            );
          })}
        </div>

        {/* PIE DE PÁGINA DE LA PREGUNTA: AVANCE, BARRA DE PROGRESO Y NAVEGACIÓN */}
        <div className="border-t border-slate-200 dark:border-slate-700/80 pt-3.5 mt-4 space-y-3">
          {/* BARRA DE AVANCE INTEGRADA EN EL PIE DE PÁGINA */}
          <div className="space-y-1.5 w-full">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                  Pregunta {currentIndex + 1}
                </span>{' '}
                <span className="text-slate-400 font-normal">de {totalPreguntas}</span>
              </span>
              <span className="text-[11px] bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-lg font-extrabold border border-amber-500/30">
                {Math.round(((currentIndex + 1) / totalPreguntas) * 100)}% Avance
              </span>
            </div>

            {/* BARRA DE PROGRESO VISIBLE */}
            <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
              <div
                className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / totalPreguntas) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="w-full">
            {isRespondida ? (
              <div className={`p-3 sm:p-4 rounded-xl border flex flex-col gap-2 animate-fadeIn transition-all ${
                currentRespuesta.esCorrecta
                  ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-950 dark:text-emerald-100'
                  : 'bg-red-500/10 dark:bg-red-950/40 border-red-500/40 text-red-950 dark:text-red-100'
              }`}>
                {modoInstantaneo ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 border-b border-emerald-500/20 pb-1.5">
                      <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm">
                        {currentRespuesta.esCorrecta ? (
                          <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                            ¡RESPUESTA CORRECTA!
                          </span>
                        ) : (
                          <span className="text-red-700 dark:text-red-400 flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                            RESPUESTA INCORRECTA
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/50 dark:bg-slate-900/50">
                        {currentRespuesta.esCorrecta ? 'ACIERTO' : 'FALLO'}
                      </span>
                    </div>

                    <div className="font-mono text-xs space-y-1">
                      <div className="flex items-start gap-1.5">
                        <span className="font-black text-amber-600 dark:text-amber-400 shrink-0">
                          Respuesta Oficial:
                        </span>
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {currentPregunta.respuesta}
                        </span>
                      </div>

                      {currentPregunta.ubicacion && (
                        <div className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1">
                          <span className="font-bold shrink-0 text-slate-500 dark:text-slate-400">Base Legal:</span>
                          <span className="font-semibold">{currentPregunta.ubicacion}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-600 dark:text-amber-400">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Respuesta seleccionada y registrada para calificación final.</span>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 italic block text-center py-1">
                Toca una alternativa para responder y ver la solución al instante
              </span>
            )}
          </div>
        </div>
      </div>

      {/* JUMP DRAWER POPUP */}
      {showJumpDrawer && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-slate-900 dark:text-slate-100 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Grid className="w-5 h-5 text-amber-500" />
              Mapa de Preguntas del Examen
            </h3>
            <button
              onClick={() => setShowJumpDrawer(false)}
              className="text-xs font-mono bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              Cerrar
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {(['todas', 'respondidas', 'pendientes', 'marcadas'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setGridFilter(f)}
                className={`px-3 py-1 rounded-full border transition-all capitalize ${
                  gridFilter === f
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid Jump Dots */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-60 overflow-y-auto p-1">
            {preguntas.map((q, idx) => {
              const resp = respuestasMap[q.id];
              const isCurrent = idx === currentIndex;
              const isBookmarked = favoritos.includes(q.id);

              if (gridFilter === 'respondidas' && !resp) return null;
              if (gridFilter === 'pendientes' && resp) return null;
              if (gridFilter === 'marcadas' && !isBookmarked) return null;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowJumpDrawer(false);
                  }}
                  className={`p-2 rounded-xl font-mono text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 active-scale ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 scale-105'
                      : resp
                      ? resp.esCorrecta
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/40'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-amber-500'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isBookmarked && <Bookmark className="w-2.5 h-2.5 fill-current text-amber-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION ACTION BAR (DESTACADO ATRÁS / ADELANTE) */}
      <div className="flex items-center justify-between gap-3 pt-3">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-700 px-6 py-3.5 rounded-2xl font-display text-xs sm:text-sm font-extrabold flex items-center gap-2.5 transition-all shadow-md active-scale"
        >
          <ArrowLeft className="w-5 h-5 text-amber-500 stroke-[2.5]" />
          <span>◄ Pregunta Anterior</span>
        </button>

        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 hidden md:inline">
          Teclas de dirección ← → para navegar
        </span>

        {currentIndex < totalPreguntas - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(totalPreguntas - 1, prev + 1))}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs sm:text-sm font-black px-8 py-3.5 rounded-2xl flex items-center gap-2.5 transition-all shadow-lg shadow-amber-500/20 active-scale border-2 border-amber-400"
          >
            <span>Siguiente Pregunta ►</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        ) : (
          <button
            onClick={handleFinalizarExamen}
            className="bg-red-600 hover:bg-red-700 text-white font-display text-xs sm:text-sm font-black px-8 py-3.5 rounded-2xl flex items-center gap-2.5 transition-all shadow-lg shadow-red-600/20 active-scale border-2 border-red-500 animate-pulse"
          >
            <span>Finalizar y Ver Nota</span>
            <CheckCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* CONFIRM FINISH MODAL */}
      {showConfirmFinish && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full text-slate-900 dark:text-slate-100 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-500">
              <AlertCircle className="w-8 h-8 shrink-0" />
              <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                ¿Finalizar examen de prueba?
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Has respondido{' '}
              <strong className="text-slate-900 dark:text-white font-bold">
                {Object.keys(respuestasMap).length} de {totalPreguntas}
              </strong>{' '}
              preguntas. Al confirmar, obtendrás tu nota oficial de ascenso, promedio ponderado y retroalimentación de respuestas.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmFinish(false)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-5 py-2.5 rounded-xl font-mono text-xs font-bold border border-slate-300 dark:border-slate-700 active-scale"
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
