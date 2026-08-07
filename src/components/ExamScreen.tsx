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
        <AlertCircle className="w-12 h-12 text-emerald-300 mx-auto" />
        <h3 className="font-display text-xl font-bold">No hay preguntas disponibles</h3>
        <p className="text-xs text-emerald-200">Selecciona otra materia o regresa al inicio.</p>
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
    <div className="max-w-4xl mx-auto space-y-4 pb-16 bg-[#01241a] text-slate-100 p-2 sm:p-4 rounded-3xl min-h-screen">
      {/* Top Control Header */}
      <div className="bg-[#004d38] border border-emerald-700/60 rounded-2xl p-2.5 sm:p-3 text-white font-mono text-[10px] sm:text-xs flex items-center justify-between gap-2 shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          {/* BOTÓN VOLVER AL PORTAL */}
          <button
            type="button"
            onClick={onCancelExamen}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-[#01241a] font-display font-extrabold text-xs flex items-center gap-2 shadow-md transition-all active-scale shrink-0"
            title="Volver al Portal de preparación"
          >
            <ArrowLeft className="w-4 h-4 text-[#01241a] shrink-0 stroke-[2.5]" />
            <span className="font-sans">Volver al Portal</span>
          </button>

          <div className="flex items-center gap-1 bg-[#003829] px-2.5 py-2 rounded-xl border border-emerald-600/60 font-bold text-emerald-200">
            <span className="text-emerald-300">{currentIndex + 1}</span>
            <span className="opacity-40">/</span>
            <span>{totalPreguntas}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {modo === 'simulacro' || modo === 'expres' ? (
            <div className="flex items-center gap-1 bg-[#003829] px-2.5 py-2 rounded-xl border border-emerald-600/60 text-emerald-300 font-black">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeFormatted}</span>
            </div>
          ) : (
            <span className="hidden xs:inline bg-[#003829] text-emerald-300 border border-emerald-600/60 px-2.5 py-2 rounded-xl font-bold uppercase text-[10px]">
              {modo.toUpperCase()}
            </span>
          )}

          <button
            onClick={() => setShowJumpDrawer(!showJumpDrawer)}
            className="bg-[#003829] text-emerald-300 border border-emerald-600/60 p-2 rounded-xl active-scale"
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

      {/* Progress Bar */}
      <div className="w-full bg-[#003829] h-2.5 rounded-full overflow-hidden border border-emerald-700/60 shadow-inner">
        <div
          className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / totalPreguntas) * 100}%` }}
        ></div>
      </div>

      {/* QUESTION CARD */}
      <div className="bg-[#004d38] text-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 relative border border-emerald-700/60 overflow-hidden space-y-4">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-400"></div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-700/60 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-600/60">
                {currentPregunta.grupo.toLowerCase()}
              </span>
              <span className="font-mono text-[11px] text-emerald-300 font-bold">
                CÓDIGO: {currentPregunta.id}
              </span>
            </div>

            <h2 className="font-display font-bold text-xs text-emerald-200 uppercase tracking-wide">
              {currentPregunta.norma}
            </h2>
          </div>
        </div>

        {/* ENUNCIADO DE LA PREGUNTA */}
        <div className="space-y-2">
          <p className="font-ubuntu font-bold text-base sm:text-xl md:text-2xl text-white leading-snug tracking-tight">
            {currentPregunta.enunciado}
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-emerald-200/80 uppercase tracking-wider font-extrabold">
              Selecciona una alternativa:
            </span>
            {modo !== 'simulacro' && (
              <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-600/60 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                RESPUESTA AL INSTANTE ACTIVADA
              </span>
            )}
          </div>
        </div>

        {/* ALTERNATIVAS */}
        <div className="grid grid-cols-1 gap-2 pt-1">
          {currentPregunta.opciones.map((opcionText, opIdx) => {
            const letra = String.fromCharCode(65 + opIdx);
            const isSelected = currentRespuesta?.opcion === opcionText;
            const esCorrecta = esRespuestaCorrecta(
              opcionText,
              currentPregunta.respuesta,
              currentPregunta.opciones
            );
            const isEliminated = currentEliminated.includes(opcionText);

            let optionStyle =
              'bg-[#003829] border-emerald-700/60 text-white hover:border-emerald-400';

            if (isSelected) {
              optionStyle =
                'bg-emerald-950 border-2 border-emerald-400 text-white font-extrabold ring-2 ring-emerald-400/40 shadow-sm';
            }

            if (modoInstantaneo && isRespondida) {
              if (esCorrecta) {
                optionStyle =
                  'bg-emerald-900 border-2 border-emerald-400 text-white font-extrabold ring-2 ring-emerald-400/40 shadow-sm';
              } else if (isSelected) {
                optionStyle =
                  'bg-red-950 border-2 border-red-500 text-red-100 font-extrabold ring-2 ring-red-500/40 shadow-sm';
              }
            }

            if (isEliminated) {
              optionStyle =
                'bg-emerald-950/40 border-emerald-900 text-emerald-600 line-through opacity-30 cursor-not-allowed';
            }

            return (
              <button
                key={opIdx}
                disabled={isEliminated}
                onClick={() => handleSelectOpcion(opcionText)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3 text-xs sm:text-sm font-ubuntu active-scale ${optionStyle}`}
              >
                <span
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs sm:text-sm shrink-0 mt-0.5 border shadow-sm transition-all ${
                    modoInstantaneo && isRespondida && esCorrecta
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : modoInstantaneo && isRespondida && isSelected && !esCorrecta
                      ? 'bg-red-600 text-white border-red-500'
                      : isSelected
                      ? 'bg-white text-[#01241a] border-white font-black'
                      : 'bg-[#004d38] text-emerald-300 border-emerald-600'
                  }`}
                >
                  {letra}
                </span>

                <span className="flex-1 leading-snug pt-0.5">{opcionText}</span>

                {modoInstantaneo && isRespondida && esCorrecta && (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 self-center" />
                )}
                {modoInstantaneo && isRespondida && isSelected && !esCorrecta && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 self-center" />
                )}
              </button>
            );
          })}
        </div>

        {/* FOOTER PREGUNTA */}
        <div className="border-t border-emerald-700/60 pt-3.5 mt-4 space-y-3">
          <div className="space-y-1.5 w-full">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-emerald-200 flex items-center gap-1.5">
                <span className="text-emerald-300 font-extrabold">
                  Pregunta {currentIndex + 1}
                </span>{' '}
                <span className="opacity-60">de {totalPreguntas}</span>
              </span>
              <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-lg font-extrabold border border-emerald-600/60">
                {Math.round(((currentIndex + 1) / totalPreguntas) * 100)}% Avance
              </span>
            </div>

            <div className="w-full bg-[#003829] h-2.5 rounded-full overflow-hidden border border-emerald-700/60 shadow-inner">
              <div
                className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / totalPreguntas) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="w-full">
            {isRespondida ? (
              <div className={`p-3 sm:p-4 rounded-xl border flex flex-col gap-2 animate-fadeIn transition-all ${
                currentRespuesta.esCorrecta
                  ? 'bg-emerald-950 border-emerald-500/60 text-white'
                  : 'bg-red-950 border-red-500/60 text-white'
              }`}>
                {modoInstantaneo ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 border-b border-emerald-700/60 pb-1.5">
                      <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm">
                        {currentRespuesta.esCorrecta ? (
                          <span className="text-emerald-300 flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            ¡RESPUESTA CORRECTA!
                          </span>
                        ) : (
                          <span className="text-red-300 flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                            RESPUESTA INCORRECTA
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="font-mono text-xs space-y-1">
                      <div className="flex items-start gap-1.5">
                        <span className="font-black text-emerald-300 shrink-0">
                          Respuesta Oficial:
                        </span>
                        <span className="font-extrabold text-white">
                          {currentPregunta.respuesta}
                        </span>
                      </div>

                      {currentPregunta.ubicacion && (
                        <div className="text-[11px] text-emerald-200 flex items-start gap-1">
                          <span className="font-bold shrink-0 text-emerald-300/80">Base Legal:</span>
                          <span className="font-semibold">{currentPregunta.ubicacion}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-300">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Respuesta seleccionada e ingresada para calificación.</span>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-[11px] font-mono text-emerald-200/80 italic block text-center py-1">
                Toca una alternativa para responder y ver la solución al instante
              </span>
            )}
          </div>
        </div>

        {/* HINT DRAWER */}
        {showHint && (
          <div className="p-3 rounded-xl bg-[#003829] border border-emerald-600/60 text-emerald-200 space-y-1 text-xs font-mono animate-fadeIn mt-4">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
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

        {/* COMODINES (MOVING TO BOTTOM) */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 bg-[#003829] p-2 rounded-xl border border-emerald-700/60 mt-4">
          <span className="text-[10px] font-mono font-bold text-emerald-300 px-1 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Herramientas:
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleUse5050}
              disabled={currentEliminated.length > 0 || isRespondida}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1 border active-scale ${
                currentEliminated.length > 0
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-700 opacity-80'
                  : 'bg-[#004d38] hover:bg-emerald-900 text-emerald-200 border-emerald-600'
              }`}
            >
              <Scissors className="w-3 h-3 text-emerald-300" />
              <span>{currentEliminated.length > 0 ? '50:50 Usado' : '50:50'}</span>
            </button>

            <button
              onClick={() => setShowHint(!showHint)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1 border active-scale ${
                showHint
                  ? 'bg-white text-[#01241a] border-white'
                  : 'bg-[#004d38] hover:bg-emerald-900 text-emerald-200 border-emerald-600'
              }`}
            >
              <Lightbulb className="w-3 h-3" />
              <span>{showHint ? 'Ocultar Pista' : 'Pista'}</span>
            </button>

            <button
              onClick={handleToggleFavorito}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1 border active-scale ${
                isFav
                  ? 'bg-red-600 text-white border-red-500 shadow-sm'
                  : 'bg-[#004d38] hover:bg-emerald-900 text-emerald-200 border-emerald-600'
              }`}
            >
              <Bookmark className={`w-3 h-3 ${isFav ? 'fill-current' : ''}`} />
              <span>{isFav ? 'Guardada' : 'Marcar'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* JUMP DRAWER */}
      {showJumpDrawer && (
        <div className="bg-[#004d38] border border-emerald-700/60 rounded-2xl p-5 text-white space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Grid className="w-5 h-5 text-emerald-300" />
              Mapa de Preguntas del Examen
            </h3>
            <button
              onClick={() => setShowJumpDrawer(false)}
              className="text-xs font-mono bg-[#003829] px-3 py-1 rounded-lg text-emerald-200 hover:text-white"
            >
              Cerrar
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {(['todas', 'respondidas', 'pendientes', 'marcadas'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setGridFilter(f)}
                className={`px-3 py-1 rounded-full border transition-all capitalize ${
                  gridFilter === f
                    ? 'bg-white text-[#01241a] border-white font-bold'
                    : 'bg-[#003829] text-emerald-200 border-emerald-700/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

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
                      ? 'bg-white text-[#01241a] ring-2 ring-emerald-300 scale-105'
                      : resp
                      ? resp.esCorrecta
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60'
                        : 'bg-red-950 text-red-300 border border-red-500/60'
                      : 'bg-[#003829] text-emerald-200 border border-emerald-700/60 hover:border-emerald-400'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isBookmarked && <Bookmark className="w-2.5 h-2.5 fill-current text-emerald-300" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* BOTTOM ACTION BAR */}
      <div className="flex items-center justify-between gap-3 pt-3">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="bg-[#004d38] hover:bg-[#005a42] disabled:opacity-40 text-white border-2 border-emerald-600 px-6 py-3.5 rounded-2xl font-display text-xs sm:text-sm font-extrabold flex items-center gap-2.5 transition-all shadow-md active-scale"
        >
          <ArrowLeft className="w-5 h-5 text-emerald-300 stroke-[2.5]" />
          <span>◄ Pregunta Anterior</span>
        </button>

        <span className="font-mono text-xs text-emerald-200/80 hidden md:inline">
          Teclas ← → para navegar
        </span>

        {currentIndex < totalPreguntas - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(totalPreguntas - 1, prev + 1))}
            className="bg-white hover:bg-emerald-50 text-[#01241a] font-display text-xs sm:text-sm font-black px-8 py-3.5 rounded-2xl flex items-center gap-2.5 transition-all shadow-lg active-scale"
          >
            <span>Siguiente Pregunta ►</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        ) : (
          <button
            onClick={handleFinalizarExamen}
            className="bg-red-600 hover:bg-red-700 text-white font-display text-xs sm:text-sm font-black px-8 py-3.5 rounded-2xl flex items-center gap-2.5 transition-all shadow-lg active-scale border-2 border-red-500 animate-pulse"
          >
            <span>Finalizar y Ver Nota</span>
            <CheckCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* CONFIRM FINISH MODAL */}
      {showConfirmFinish && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#004d38] border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-300">
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
                className="bg-[#003829] hover:bg-emerald-900 text-emerald-200 px-5 py-2.5 rounded-xl font-mono text-xs font-bold border border-emerald-600 active-scale"
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
