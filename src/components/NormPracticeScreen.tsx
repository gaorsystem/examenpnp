import React, { useState } from 'react';
import { Shield, BookOpen, Search, ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { NormaInfo, GrupoMateria } from '../types';
import { getNormasInfo } from '../data/questionsData';
import { SimulacroInfoModal, ExamModalDetails } from './SimulacroInfoModal';

interface NormPracticeScreenProps {
  onStartExamenNorma: (normaNombre: string, cantidad: number) => void;
}

export const NormPracticeScreen: React.FC<NormPracticeScreenProps> = ({ onStartExamenNorma }) => {
  const normas = getNormasInfo();
  const [grupoFiltro, setGrupoFiltro] = useState<'TODOS' | GrupoMateria>('TODOS');
  const [search, setSearch] = useState('');
  const [selectedNorma, setSelectedNorma] = useState<NormaInfo | null>(normas[0] || null);
  const [cantidad, setCantidad] = useState<number>(15);
  const [selectedExamDetails, setSelectedExamDetails] = useState<ExamModalDetails | null>(null);

  const filteredNormas = normas.filter((n) => {
    const matchGrupo = grupoFiltro === 'TODOS' || n.grupo === grupoFiltro;
    const matchSearch = n.nombre.toLowerCase().includes(search.toLowerCase());
    return matchGrupo && matchSearch;
  });

  const handleConfirmStartNorma = () => {
    if (!selectedNorma) return;
    setSelectedExamDetails({
      mode: 'norma',
      title: `Estudio Focalizado: ${selectedNorma.nombre}`,
      badge: `📖 ${cantidad} Preguntas por Norma`,
      badgeColor: 'bg-amber-600 text-white font-black',
      finalidad: `Evaluar y consolidar tu nivel de acierto en los artículos y disposiciones de la norma legal "${selectedNorma.nombre}".`,
      comoFunciona: [
        `Resolverás ${cantidad} preguntas de opción múltiple pertenecientes a esta ley.`,
        'Al marcar cada respuesta verás el número de artículo legal que sustenta la solución.',
        'Podrás apoyarte en el Profesor IA para despejar cualquier duda interpretativa.'
      ],
      preguntasCount: cantidad,
      tiempoEstimado: 'Sin límite de tiempo',
      permiteAyudas: true,
      retroalimentacion: 'instantanea',
      onConfirm: () => onStartExamenNorma(selectedNorma.nombre, cantidad)
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 text-slate-900 dark:text-slate-100 shadow-sm">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-amber-500" />
          Práctica por Materia y Norma (22 Fuentes)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed max-w-2xl">
          Selecciona una fuente normativa específica del banco oficial PNP 2026 para realizar un test focalizado en sus artículos y disposiciones.
        </p>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setGrupoFiltro('TODOS')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                grupoFiltro === 'TODOS' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todas las Materias ({normas.length})
            </button>
            <button
              onClick={() => setGrupoFiltro('COMUNES')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                grupoFiltro === 'COMUNES' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Materias Comunes
            </button>
            <button
              onClick={() => setGrupoFiltro('ESPECIALIDAD')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                grupoFiltro === 'ESPECIALIDAD' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Especialidad
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar norma o ley..."
              className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-amber-500 font-sans w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Grid of Norms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNormas.map((n) => {
          const isSelected = selectedNorma?.id === n.id;

          return (
            <div
              key={n.id}
              onClick={() => setSelectedNorma(n)}
              className={`bg-white dark:bg-slate-800/80 border rounded-2xl p-5 cursor-pointer transition-all shadow-sm flex flex-col justify-between group ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-500/5'
                  : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                      n.grupo === 'COMUNES'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {n.grupo}
                  </span>
                  <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold bg-slate-100 dark:bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    {n.totalPreguntas} preguntas
                  </span>
                </div>

                <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-3">
                  {n.nombre}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">Banco PNP 2026</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartExamenNorma(n.nombre, cantidad);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all shadow-sm active-scale"
                >
                  <Play className="w-3 h-3 fill-current" />
                  Practicar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Norm Configuration Drawer Modal */}
      {selectedNorma && (
        <div className="bg-white dark:bg-slate-800 border border-amber-500/40 rounded-2xl p-6 text-slate-900 dark:text-slate-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400 uppercase font-bold">
              Norma Seleccionada
            </span>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {selectedNorma.nombre}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Grupo: {selectedNorma.grupo} · Total de preguntas disponibles en el banco: {selectedNorma.totalPreguntas}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-600 dark:text-slate-300">Cantidad:</span>
              <select
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="bg-slate-100 dark:bg-slate-900 text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 font-bold focus:outline-none"
              >
                <option value={10}>10 Preguntas</option>
                <option value={15}>15 Preguntas</option>
                <option value={20}>20 Preguntas</option>
                <option value={selectedNorma.totalPreguntas}>Todas ({selectedNorma.totalPreguntas})</option>
              </select>
            </div>

            <button
              onClick={handleConfirmStartNorma}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active-scale"
            >
              <Play className="w-4 h-4 fill-current" />
              Iniciar Examen
            </button>
          </div>
        </div>
      )}

      {/* Modal Popup informativo */}
      <SimulacroInfoModal
        isOpen={selectedExamDetails !== null}
        details={selectedExamDetails}
        onClose={() => setSelectedExamDetails(null)}
      />
    </div>
  );
};
