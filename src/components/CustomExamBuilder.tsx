import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Play,
  CheckSquare,
  Square,
  Clock,
  BookOpen,
  Filter,
  Sparkles,
  HelpCircle,
  Search,
  Bookmark,
  Shuffle,
  Shield,
  Layers,
} from 'lucide-react';
import { BANCO_PREGUNTAS } from '../data/questionsData';
import { Pregunta, GrupoMateria } from '../types';
import { barajar } from '../data/questionsData';
import { getFavoritos } from '../lib/srsStorage';

interface CustomExamBuilderProps {
  onStartCustomExamen: (
    preguntas: Pregunta[],
    tiempoMinutos: number,
    tituloSimulacro: string
  ) => void;
}

export const CustomExamBuilder: React.FC<CustomExamBuilderProps> = ({
  onStartCustomExamen,
}) => {
  // Get all unique norms from BANCO_PREGUNTAS
  const listNormas = Array.from(new Set(BANCO_PREGUNTAS.map((q) => q.norma)));

  // Selected Norms State (default: all)
  const [selectedNormas, setSelectedNormas] = useState<string[]>(listNormas);

  // Group Filter state
  const [numPreguntas, setNumPreguntas] = useState<number>(20);
  const [tiempoMinutos, setTiempoMinutos] = useState<number>(20);
  const [modoFiltro, setModoFiltro] = useState<'TODAS' | 'FALLADAS' | 'FAVORITAS'>('TODAS');
  const [manualSelection, setManualSelection] = useState<boolean>(false);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [busquedaManual, setBusquedaManual] = useState<string>('');

  const favoritedIds = getFavoritos();

  // Handle Norm Toggle
  const toggleNorma = (norma: string) => {
    if (selectedNormas.includes(norma)) {
      setSelectedNormas(selectedNormas.filter((n) => n !== norma));
    } else {
      setSelectedNormas([...selectedNormas, norma]);
    }
  };

  const selectAllNormas = () => setSelectedNormas(listNormas);
  const deselectAllNormas = () => setSelectedNormas([]);

  const selectGroupNormas = (grupo: GrupoMateria) => {
    const normasGrupo = Array.from(
      new Set(BANCO_PREGUNTAS.filter((q) => q.grupo === grupo).map((q) => q.norma))
    );
    setSelectedNormas(normasGrupo);
  };

  // Filter available questions based on configuration
  const preguntasDisponibles = BANCO_PREGUNTAS.filter((q) => {
    const normMatch = selectedNormas.includes(q.norma);
    if (!normMatch) return false;

    if (modoFiltro === 'FAVORITAS') {
      return favoritedIds.includes(q.id);
    }
    return true;
  });

  // Manual Question Search List
  const preguntasManualList = preguntasDisponibles.filter((q) => {
    if (!busquedaManual.trim()) return true;
    const search = busquedaManual.toLowerCase();
    return (
      q.id.toLowerCase().includes(search) ||
      q.enunciado.toLowerCase().includes(search) ||
      q.norma.toLowerCase().includes(search)
    );
  });

  const toggleSelectQuestionManual = (id: string) => {
    if (selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds(selectedQuestionIds.filter((qId) => qId !== id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, id]);
    }
  };

  const handleLaunch = () => {
    let finalQuestions: Pregunta[] = [];

    if (manualSelection && selectedQuestionIds.length > 0) {
      finalQuestions = BANCO_PREGUNTAS.filter((q) => selectedQuestionIds.includes(q.id));
    } else {
      finalQuestions = barajar(preguntasDisponibles).slice(
        0,
        Math.min(numPreguntas, preguntasDisponibles.length)
      );
    }

    if (finalQuestions.length === 0) {
      alert('Debes seleccionar al menos una norma o pregunta para armar tu simulacro.');
      return;
    }

    const titulo = `Simulacro Personalizado (${finalQuestions.length} preg.)`;
    onStartCustomExamen(finalQuestions, tiempoMinutos, titulo);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-500 shrink-0">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Arma tu Propio Simulacro Personalizado
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Personaliza los temas, cantidad de preguntas, tiempo y criterios de selección a tu medida.
            </p>
          </div>
        </div>
      </div>

      {/* STEP 1: Select Norms / Topics */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-3">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            1. Selecciona las Materias y Normas Legales ({selectedNormas.length} de {listNormas.length})
          </h3>

          {/* Quick Selection Buttons */}
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={selectAllNormas}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-2.5 py-1 rounded-lg transition-colors"
            >
              Seleccionar Todas
            </button>
            <button
              type="button"
              onClick={() => selectGroupNormas('COMUNES')}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg transition-colors"
            >
              Solo Comunes
            </button>
            <button
              type="button"
              onClick={() => selectGroupNormas('ESPECIALIDAD')}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg transition-colors"
            >
              Solo Especialidad
            </button>
            <button
              type="button"
              onClick={deselectAllNormas}
              className="bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-red-500 border border-slate-300 dark:border-slate-700 px-2.5 py-1 rounded-lg transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Norms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
          {listNormas.map((norma, idx) => {
            const isSelected = selectedNormas.includes(norma);
            const totalCount = BANCO_PREGUNTAS.filter((q) => q.norma === norma).length;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleNorma(norma)}
                className={`p-3 rounded-2xl border text-xs text-left transition-all flex items-start gap-2.5 active-scale ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white font-semibold'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {isSelected ? (
                  <CheckSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="line-clamp-2 leading-snug font-sans">{norma}</p>
                  <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                    {totalCount} preguntas en banco
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: Configure Questions Count & Timer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Question Count */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-sm space-y-3">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            2. Cantidad de Preguntas
          </h3>

          <div className="grid grid-cols-5 gap-2 font-mono text-xs">
            {[10, 20, 30, 50, 100].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setNumPreguntas(count)}
                className={`py-2.5 rounded-xl font-bold border transition-all ${
                  numPreguntas === count
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-500'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Preguntas disponibles con tus filtros actualizados: <strong>{preguntasDisponibles.length}</strong>
          </p>
        </div>

        {/* Timer Option */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-sm space-y-3">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            3. Tiempo Límite del Simulacro
          </h3>

          <div className="grid grid-cols-4 gap-2 font-mono text-xs">
            {[
              { label: '10 min', val: 10 },
              { label: '20 min', val: 20 },
              { label: '45 min', val: 45 },
              { label: '120 min', val: 120 },
            ].map((t) => (
              <button
                key={t.val}
                type="button"
                onClick={() => setTiempoMinutos(t.val)}
                className={`py-2.5 rounded-xl font-bold border transition-all ${
                  tiempoMinutos === t.val
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-500'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 3: Question Filtering / Manual Picker Toggle */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-3">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-amber-500" />
            4. Modo de Selección de Preguntas
          </h3>

          {/* Toggle Manual Picker */}
          <button
            type="button"
            onClick={() => setManualSelection(!manualSelection)}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1.5 ${
              manualSelection
                ? 'bg-amber-500 text-slate-950 border-amber-500'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{manualSelection ? 'Modo Selección Manual Activado' : 'Activar Selección Manual de Preguntas'}</span>
          </button>
        </div>

        {!manualSelection ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={() => setModoFiltro('TODAS')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                modoFiltro === 'TODAS'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Shuffle className="w-4 h-4 text-amber-500" />
                <span>Aleatoria Mixta</span>
              </div>
              <p className="text-[11px] font-sans font-normal text-slate-500">
                Extrae preguntas al azar de las normas seleccionadas.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setModoFiltro('FAVORITAS')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                modoFiltro === 'FAVORITAS'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Bookmark className="w-4 h-4 text-red-500" />
                <span>Solo Favoritas ({favoritedIds.length})</span>
              </div>
              <p className="text-[11px] font-sans font-normal text-slate-500">
                Examen compuesto solo por las preguntas que has guardado como favoritas.
              </p>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busquedaManual}
                  onChange={(e) => setBusquedaManual(e.target.value)}
                  placeholder="Buscar por código, código penal, arresto, etc..."
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-amber-500"
                />
              </div>
              <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold shrink-0">
                {selectedQuestionIds.length} seleccionadas
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
              {preguntasManualList.slice(0, 40).map((q) => {
                const isSelected = selectedQuestionIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => toggleSelectQuestionManual(q.id)}
                    className={`py-2 px-3 rounded-xl border text-xs cursor-pointer my-1 transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white font-semibold'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        #{q.id}
                      </span>
                      <p className="truncate font-sans">{q.enunciado}</p>
                    </div>
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* LAUNCH BUTTON */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={handleLaunch}
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-lg px-10 py-4 rounded-2xl shadow-xl transition-all border-2 border-amber-300 flex items-center justify-center gap-3 mx-auto active-scale"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>GENERAR E INICIAR MI SIMULACRO PERSONALIZADO</span>
        </button>
      </div>
    </div>
  );
};
