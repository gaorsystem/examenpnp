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
} from 'lucide-react';
import { Pregunta, RespuestaUsuario, IntentoExamen } from '../types';
import { getFavoritos, toggleFavorito } from '../lib/srsStorage';
import { AudioButton } from './AudioButton';

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
    modo === 'repaso' || modo === 'norma'
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
    const esCorrecta = opcionElegida.trim() === currentPregunta.respuesta.trim();

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

    const correctIndex = currentPregunta.opciones.findIndex(
      (op) => op.trim() === currentPregunta.respuesta.trim()
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
      const esCorrecta = resp ? opcionElegida.trim() === q.respuesta.trim() : false;
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
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-2 sm:p-3 text-slate-900 dark:text-slate-100 font-mono text-[10px] sm:text-xs flex items-center justify-between gap-2 shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onCancelExamen}
            className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-600 transition-all active-scale flex items-center gap-1.5 font-black uppercase tracking-tighter"
            title="Regresar al Portal"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[9px] sm:text-[10px]">SALIR</span>
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
            <span className="hidden xs:inline bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2 py-2 rounded-xl font-bold uppercase text-[9px]">
              {modo.toUpperCase()}
            </span>
          )}

          <button
            onClick={() => setShowJumpDrawer(!showJumpDrawer)}
            className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-amber-400 border border-slate-200 dark:border-slate-700 p-2 rounded-xl active-scale"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowConfirmFinish(true)}
            className="bg-red-600 text-white px-3 py-2 rounded-xl font-black shadow-sm active-scale text-[10px]"
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
      <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-3xl shadow-xl p-6 sm:p-8 relative border border-slate-200 dark:border-slate-700/80 overflow-hidden space-y-6">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>

        {/* Official PNP Stamp Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                  currentPregunta.grupo === 'COMUNES'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                }`}
              >
                Materias {currentPregunta.grupo.toLowerCase()}
              </span>
              <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">
                CÓDIGO PNP: {currentPregunta.id}
              </span>
            </div>

            <h2 className="font-display font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              {currentPregunta.norma}
            </h2>
          </div>

          {/* Interactive Audio Player Button */}
          <div className="shrink-0">
            <AudioButton
              textToRead={`Pregunta número ${currentIndex + 1}. Norma: ${currentPregunta.norma}. ${currentPregunta.enunciado}. Alternativas: ${currentPregunta.opciones.map((op, i) => `Opción ${String.fromCharCode(65 + i)}: ${op}`).join('. ')}`}
              label="Escuchar Pregunta"
              size="md"
            />
          </div>
        </div>

        {/* INTERACTIVE LIFELINES & STUDY TOOLS BAR (COMODINES) */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 px-2 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            Herramientas Interactivas:
          </span>

          <div className="flex items-center gap-2">
            {/* 50:50 Lifeline Button */}
            <button
              onClick={handleUse5050}
              disabled={currentEliminated.length > 0 || isRespondida}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 border active-scale ${
                currentEliminated.length > 0
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 opacity-80'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-amber-400 border-slate-300 dark:border-slate-700 shadow-sm'
              }`}
              title="Descartar 2 alternativas incorrectas"
            >
              <Scissors className="w-3.5 h-3.5 text-amber-500" />
              <span>{currentEliminated.length > 0 ? 'Descarte 50:50 Usado' : '50:50 Descarte'}</span>
            </button>

            {/* Hint Toggle Button */}
            <button
              onClick={() => setShowHint(!showHint)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 border active-scale ${
                showHint
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              }`}
              title="Ver pista o referencia de ley"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHint ? 'Ocultar Pista' : 'Ver Pista Legal'}</span>
            </button>

            {/* Bookmark Question Button */}
            <button
              onClick={handleToggleFavorito}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 border active-scale ${
                isFav
                  ? 'bg-red-600 text-white border-red-500 shadow-sm'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              }`}
              title="Guardar en lista de repaso prioritario SRS"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
              <span>{isFav ? 'Marcada' : 'Marcar'}</span>
            </button>
          </div>
        </div>

        {/* HINT FLOATING DRAWER */}
        {showHint && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-800 dark:text-slate-200 space-y-2 text-xs font-mono animate-fadeIn">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
              <Lightbulb className="w-4 h-4 fill-current" />
              <span>Referencia del Balotario Oficial:</span>
            </div>
            <p className="leading-relaxed">
              {currentPregunta.ubicacion
                ? `Esta pregunta corresponde a: ${currentPregunta.ubicacion}. Analiza con detenimiento la redacción técnica del texto legal.`
                : 'Esta pregunta proviene de las materias fundamentales del temario oficial PNP 2026. Recuerda distinguir los plazos y causales taxativas.'}
            </p>
          </div>
        )}

        {/* ENUNCIADO DE LA PREGUNTA */}
        <div className="space-y-4">
          <p className="font-display font-black text-xl sm:text-2xl md:text-3xl text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            {currentPregunta.enunciado}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setModoInstantaneo(!modoInstantaneo)}
              className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-all ${
                modoInstantaneo 
                  ? 'bg-amber-500 text-slate-950 border-amber-400' 
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
            >
              FEEDBACK: {modoInstantaneo ? 'ON' : 'OFF'}
            </button>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
              Toca la respuesta correcta:
            </span>
          </div>
        </div>

        {/* ALTERNATIVAS INTERACTIVAS (OPTION CARDS) */}
        <div className="grid grid-cols-1 gap-3 pt-2">
          {currentPregunta.opciones.map((opcionText, opIdx) => {
            const letra = String.fromCharCode(65 + opIdx); // A, B, C, D, E
            const isSelected = currentRespuesta?.opcion === opcionText;
            const esCorrecta = opcionText.trim() === currentPregunta.respuesta.trim();
            const isEliminated = currentEliminated.includes(opcionText);

            let optionStyle =
              'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100';

            if (isSelected) {
              optionStyle =
                'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500 text-slate-900 dark:text-white font-bold ring-1 ring-amber-500';
            }

            if (modoInstantaneo && isRespondida) {
              if (esCorrecta) {
                optionStyle =
                  'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold ring-1 ring-emerald-500';
              } else if (isSelected) {
                optionStyle =
                  'bg-red-500/10 dark:bg-red-500/20 border-red-500 text-red-900 dark:text-red-100 font-bold ring-1 ring-red-500';
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
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-4 text-sm sm:text-lg font-sans active-scale ${optionStyle}`}
              >
                {/* Letter Pill */}
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-base shrink-0 mt-0.5 border shadow-sm transition-all ${
                    modoInstantaneo && isRespondida && esCorrecta
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : modoInstantaneo && isRespondida && isSelected && !esCorrecta
                      ? 'bg-red-500 text-white border-red-400'
                      : isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {letra}
                </span>

                {/* Text Content */}
                <span className="flex-1 leading-[1.3] pt-1">{opcionText}</span>

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

        {/* FEEDBACK & RATIONALE FOOTER PANEL */}
        {modoInstantaneo && isRespondida && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-3 font-mono text-xs animate-fadeIn shadow-md">
            <div className="flex items-center gap-2 text-sm font-bold">
              {currentRespuesta.esCorrecta ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ¡Excelente Oficial! Respuesta Correcta Confirmada
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <XCircle className="w-5 h-5 text-red-500" />
                  Respuesta Incorrecta — Revisa la Base Legal Oficial
                </span>
              )}
            </div>

            <p className="text-slate-800 dark:text-slate-200 leading-relaxed pt-1 border-t border-slate-200 dark:border-slate-700/80">
              <strong className="text-slate-900 dark:text-white font-bold">Alternativa Oficial:</strong>{' '}
              <span className="text-amber-600 dark:text-amber-400 font-bold">{currentPregunta.respuesta}</span>
            </p>

            {currentPregunta.ubicacion && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                <strong className="text-slate-800 dark:text-slate-200">Sustento en Reglamento:</strong> {currentPregunta.ubicacion}
              </p>
            )}
          </div>
        )}
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

      {/* BOTTOM NAVIGATION ACTION BAR */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-5 py-3 rounded-2xl font-display text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm active-scale"
        >
          <ArrowLeft className="w-4 h-4 text-amber-500" />
          <span>Anterior</span>
        </button>

        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
          Usa teclas de dirección ← → para navegar
        </span>

        {currentIndex < totalPreguntas - 1 ? (
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(totalPreguntas - 1, prev + 1))}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs sm:text-sm font-black px-7 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-md active-scale border border-amber-400"
          >
            <span>Siguiente</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinalizarExamen}
            className="bg-red-600 hover:bg-red-700 text-white font-display text-xs sm:text-sm font-black px-7 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-md active-scale border border-red-500 animate-pulse"
          >
            <span>Finalizar y Ver Nota</span>
            <CheckCircle className="w-4 h-4" />
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
