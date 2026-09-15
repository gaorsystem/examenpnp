import React, { useState, useMemo } from 'react';
import {
  Shield,
  BookOpen,
  CheckCircle2,
  Play,
  Layers,
  Sparkles,
  Sliders,
  RotateCcw,
  CheckSquare,
  Square,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Plus,
  Eye,
  FileText,
  TrendingUp,
  Scale,
  Gavel,
  Ban,
  ShieldCheck,
  Target,
  Zap,
} from 'lucide-react';
import { Pregunta } from '../types';
import {
  BANCO_PREGUNTAS,
  getNormasInfo,
  getPreguntasPorNorma,
  barajar,
} from '../data/questionsData';

interface SimulacroHubScreenProps {
  onStartCustomExamen: (
    preguntas: Pregunta[],
    tiempoMinutos: number,
    tituloSimulacro: string
  ) => void;
  onNavigateTab: (tab: string) => void;
}

export const SimulacroHubScreen: React.FC<SimulacroHubScreenProps> = ({
  onStartCustomExamen,
}) => {
  const todasLasNormas = useMemo(() => getNormasInfo(), []);

  // Por defecto, todos los temas inician desmarcados según solicitud del usuario
  const [selectedTemas, setSelectedTemas] = useState<string[]>([]);

  // Desplegables informativos (solo lectura, no selectores)
  const [showConstitucionInfo, setShowConstitucionInfo] = useState<boolean>(false);
  const [showDl1267Info, setShowDl1267Info] = useState<boolean>(false);
  const [showDl1291Info, setShowDl1291Info] = useState<boolean>(false);
  const [showLey27806Info, setShowLey27806Info] = useState<boolean>(false);
  const [showLeyAscensoInfo, setShowLeyAscensoInfo] = useState<boolean>(false);
  const [showLey27444Info, setShowLey27444Info] = useState<boolean>(false);
  const [showDl957Info, setShowDl957Info] = useState<boolean>(false);
  const [showUsoFuerzaInfo, setShowUsoFuerzaInfo] = useState<boolean>(false);
  const [showTidInfo, setShowTidInfo] = useState<boolean>(false);

  // Alternar selección de un tema (marcar / desmarcar libremente)
  const handleToggleTema = (normaNombre: string) => {
    setSelectedTemas((prev) => {
      if (prev.includes(normaNombre)) {
        return prev.filter((t) => t !== normaNombre);
      } else {
        return [...prev, normaNombre];
      }
    });
  };

  // Botones de selección rápida
  const handleSelectAll = () => {
    setSelectedTemas([
      'CONSTITUCIÓN POLÍTICA DEL PERÚ',
      'D.L. 1267 - LEY DE LA POLICÍA NACIONAL DEL PERÚ',
      'DECRETO LEGISLATIVO N° 1291 - LUCHA CONTRA LA CORRUPCIÓN',
    ]);
  };

  const handleSelectOnlyConstitucion = () => {
    setSelectedTemas(['CONSTITUCIÓN POLÍTICA DEL PERÚ']);
  };

  const handleSelectOnlyDl1267 = () => {
    setSelectedTemas(['D.L. 1267 - LEY DE LA POLICÍA NACIONAL DEL PERÚ']);
  };

  const handleSelectOnlyDl1291 = () => {
    setSelectedTemas(['DECRETO LEGISLATIVO N° 1291 - LUCHA CONTRA LA CORRUPCIÓN']);
  };

  // Iniciar simulacro específico para un tema individual
  const handleStartSingleTemaExamen = (normaNombre: string) => {
    const preguntasNorma = BANCO_PREGUNTAS.filter((q) => q.norma === normaNombre).sort((a, b) => a.numero - b.numero);
    const tiempo = preguntasNorma.length >= 100 ? 120 : Math.max(10, preguntasNorma.length);
    const titulo = `Simulacro: ${normaNombre} (${preguntasNorma.length} Preguntas)`;
    onStartCustomExamen(preguntasNorma, tiempo, titulo);
  };

  // Banco de preguntas disponibles según los temas seleccionados
  const preguntasDisponibles = useMemo(() => {
    return BANCO_PREGUNTAS.filter((q) => selectedTemas.includes(q.norma));
  }, [selectedTemas]);

  // Total de preguntas que tendrá el simulacro
  const totalPreguntasSimulacro = preguntasDisponibles.length;

  // Tiempo sugerido oficial (120 min si son 100 o más preguntas, o 1 min por reactivo)
  const tiempoSugerido = useMemo(() => {
    if (totalPreguntasSimulacro >= 100) return 120;
    return Math.max(10, totalPreguntasSimulacro);
  }, [totalPreguntasSimulacro]);

  // Iniciar el simulacro directamente
  const handleStartSimulacro = () => {
    if (preguntasDisponibles.length === 0) return;

    // Preguntas oficiales ordenadas correlativamente
    const preguntasFinales = [...preguntasDisponibles].sort((a, b) => a.numero - b.numero);

    // Título descriptivo
    let titulo = 'Simulacro: ';
    if (selectedTemas.length === 1) {
      titulo += `${selectedTemas[0]} (${preguntasFinales.length} Preguntas)`;
    } else {
      titulo += `${selectedTemas.length} Temas Oficiales (${preguntasFinales.length} Preguntas)`;
    }

    onStartCustomExamen(preguntasFinales, tiempoSugerido, titulo);
  };

  const isSoloConstitucion =
    selectedTemas.length === 1 &&
    selectedTemas[0] === 'CONSTITUCIÓN POLÍTICA DEL PERÚ';

  const isSoloDl1267 =
    selectedTemas.length === 1 &&
    selectedTemas[0] === 'D.L. 1267 - LEY DE LA POLICÍA NACIONAL DEL PERÚ';

  const isSoloDl1291 =
    selectedTemas.length === 1 &&
    selectedTemas[0] === 'DECRETO LEGISLATIVO N° 1291 - LUCHA CONTRA LA CORRUPCIÓN';

  const isTodosLosTemas = selectedTemas.length === 3;

  return (
    <div className="space-y-6 max-w-none mx-auto pb-16 px-2 sm:px-4">
      {/* Banner Principal - Estilo Elegante */}
      <div className="bg-[#011a14] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-900/30 border border-emerald-800/50 px-3 py-1 rounded-lg text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Configuración de Evaluación Táctica</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none">
              Simulacro por Temas
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Balotario Oficial PNP 2026</p>
          </div>

          <div className="bg-[#01261d] px-6 py-4 rounded-xl border border-emerald-800/30 flex items-center gap-6 shrink-0 shadow-inner">
            <div className="text-right">
              <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-tight">
                TEMAS SELECCIONADOS
              </span>
              <span className="text-xl font-bold text-emerald-500">
                {selectedTemas.length} <span className="text-xs text-slate-600">/ {todasLasNormas.length}</span>
              </span>
            </div>
            <div className="h-8 w-px bg-emerald-800/30"></div>
            <div className="text-right">
              <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-tight">
                TOTAL REACTIVOS
              </span>
              <span className="text-xl font-bold text-white">
                {preguntasDisponibles.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: SELECCIÓN DE TEMAS */}
      <div className="bg-[#011a14] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-900/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg text-white uppercase tracking-tight">
              Selección de Materias
            </h2>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
            Combina varios temas para un simulacro integral
          </p>
        </div>

        {/* LISTA DE TEMAS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              Malla Curricular Oficial 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {todasLasNormas.map((norma, index) => {
            // Generate a deterministic color palette based on index
            const palettes = [
              { border: 'border-rose-200 dark:border-rose-900', ring: 'ring-rose-500/20', bgCheck: 'bg-rose-50 dark:bg-rose-950/20', badgeBg: 'bg-rose-100 dark:bg-rose-900/40', badgeText: 'text-rose-700 dark:text-rose-300', iconBg: 'bg-rose-600', hoverText: 'hover:text-rose-700 dark:hover:text-rose-400' },
              { border: 'border-blue-200 dark:border-blue-900', ring: 'ring-blue-500/20', bgCheck: 'bg-blue-50 dark:bg-blue-950/20', badgeBg: 'bg-blue-100 dark:bg-blue-900/40', badgeText: 'text-blue-700 dark:text-blue-300', iconBg: 'bg-blue-600', hoverText: 'hover:text-blue-700 dark:hover:text-blue-400' },
              { border: 'border-amber-200 dark:border-amber-900', ring: 'ring-amber-500/20', bgCheck: 'bg-amber-50 dark:bg-amber-950/20', badgeBg: 'bg-amber-100 dark:bg-amber-900/40', badgeText: 'text-amber-700 dark:text-amber-300', iconBg: 'bg-amber-600', hoverText: 'hover:text-amber-700 dark:hover:text-amber-400' },
              { border: 'border-emerald-200 dark:border-emerald-900', ring: 'ring-emerald-500/20', bgCheck: 'bg-emerald-50 dark:bg-emerald-950/20', badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40', badgeText: 'text-emerald-700 dark:text-emerald-600 dark:text-emerald-300', iconBg: 'bg-emerald-600', hoverText: 'hover:text-emerald-700 dark:hover:text-emerald-400' },
              { border: 'border-indigo-200 dark:border-indigo-900', ring: 'ring-indigo-500/20', bgCheck: 'bg-indigo-50 dark:bg-indigo-950/20', badgeBg: 'bg-indigo-100 dark:bg-indigo-900/40', badgeText: 'text-indigo-700 dark:text-indigo-300', iconBg: 'bg-indigo-600', hoverText: 'hover:text-indigo-700 dark:hover:text-indigo-400' },
              { border: 'border-violet-200 dark:border-violet-900', ring: 'ring-violet-500/20', bgCheck: 'bg-violet-50 dark:bg-violet-950/20', badgeBg: 'bg-violet-100 dark:bg-violet-900/40', badgeText: 'text-violet-700 dark:text-violet-300', iconBg: 'bg-violet-600', hoverText: 'hover:text-violet-700 dark:hover:text-violet-400' },
              { border: 'border-teal-200 dark:border-teal-900', ring: 'ring-teal-500/20', bgCheck: 'bg-teal-50 dark:bg-teal-950/20', badgeBg: 'bg-teal-100 dark:bg-teal-900/40', badgeText: 'text-teal-700 dark:text-teal-300', iconBg: 'bg-teal-600', hoverText: 'hover:text-teal-700 dark:hover:text-teal-400' },
              { border: 'border-orange-200 dark:border-orange-900', ring: 'ring-orange-500/20', bgCheck: 'bg-orange-50 dark:bg-orange-950/20', badgeBg: 'bg-orange-100 dark:bg-orange-900/40', badgeText: 'text-orange-700 dark:text-orange-300', iconBg: 'bg-orange-600', hoverText: 'hover:text-orange-700 dark:hover:text-orange-400' }
            ];
            const p = palettes[index % palettes.length];

            const isSelected = selectedTemas.includes(norma.nombre);
            const isConstitucion = norma.nombre === 'CONSTITUCIÓN POLÍTICA DEL PERÚ';
            const isDl1267 = norma.nombre.includes('1267');
            const isDl1291 = norma.nombre.includes('1291');
            const isLey27806 = norma.nombre.includes('27806') || norma.nombre.includes('TRANSPARENCIA');
            const isLeyAscenso = norma.nombre.includes('ASCENSO') || norma.nombre.includes('31873');
            const isLey27444 = norma.nombre.includes('27444') || norma.nombre.includes('PROCEDIMIENTO ADMINISTRATIVO');
            const isDl957 = norma.nombre.includes('957') || norma.nombre.includes('PROCESAL PENAL');
            const isUsoFuerza = norma.nombre.includes('1186') || norma.nombre.includes('USO DE LA FUERZA');
            const isTid = norma.nombre.includes('1241') || norma.nombre.includes('TRÁFICO ILÍCITO') || norma.nombre.includes('DROGAS');
            const isDesgloseOpen = isConstitucion
              ? showConstitucionInfo
              : isDl1267
              ? showDl1267Info
              : isDl1291
              ? showDl1291Info
              : isLey27806
              ? showLey27806Info
              : isLeyAscenso
              ? showLeyAscensoInfo
              : isLey27444
              ? showLey27444Info
              : isDl957
              ? showDl957Info
              : isUsoFuerza
              ? showUsoFuerzaInfo
              : isTid
              ? showTidInfo
              : false;

            const cardInfo = isConstitucion
              ? {
                  displayName: 'Constitución Política del Perú',
                  categoria: 'Constitucional',
                  icon: BookOpen,
                  color: 'rose',
                  descripcion:
                    'Derechos y deberes fundamentales de la persona, garantías constitucionales, estructura del Estado y régimen de excepción.',
                  imagen:
                    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
                  destacado: `${norma.totalPreguntas} Preguntas`,
                }
              : isDl1267
              ? {
                  displayName: 'Ley de la Policía Nacional (D.L. 1267)',
                  categoria: 'Legislación PNP',
                  icon: Shield,
                  color: 'blue',
                  descripcion:
                    'Estructura orgánica, principios institucionales, funciones, atribuciones, mando y régimen de bienestar policial.',
                  imagen:
                    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
                  destacado: `${norma.totalPreguntas} Preguntas`,
                }
              : isDl1291
              ? {
                  displayName: 'Lucha contra la Corrupción (D.L. 1291)',
                  categoria: 'Anticorrupción',
                  icon: ShieldCheck,
                  color: 'amber',
                  descripcion:
                    'Declaraciones juradas de bienes, pruebas de control y confianza (polígrafo), prueba de integridad y régimen disciplinario.',
                  imagen:
                    'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
                  destacado: `${norma.totalPreguntas} Preguntas`,
                }
              : isLey27806
              ? {
                  displayName: 'Ley de Transparencia y Acceso a la Información (Ley 27806)',
                  categoria: 'Transparencia',
                  icon: Eye,
                  color: 'emerald',
                  descripcion:
                    'Procedimiento de acceso a la información, excepciones, plazos oficiales, transparencia del Sistema de Justicia y régimen sancionador.',
                  imagen:
                    'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
                  destacado: `${norma.totalPreguntas} Preguntas`,
                }
              : isLeyAscenso
              ? {
                  displayName: 'Ley de Procesos de Ascenso de la PNP (Ley 31873)',
                  categoria: 'Ascenso PNP',
                  icon: TrendingUp,
                  color: 'indigo',
                  descripcion:
                    'Principios rectores, etapas del proceso, requisitos y cuadros de tiempos mínimos de servicios en el grado y en la institución.',
                  imagen:
                    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
                  destacado: `${norma.totalPreguntas} Preguntas`,
                }
              : isLey27444
              ? {
                  displayName: 'Procedimiento Administrativo General (Ley 27444)',
                  categoria: 'Derecho Administrativo',
                  icon: Scale,
                  color: 'violet',
                  descripcion:
                    'Principios rectores, validez y nulidad de actos, notificaciones, plazos, pruebas, recursos impugnatorios y deberes del procedimiento.',
                  imagen:
                    'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
                  destacado: `${norma.totalPreguntas} Preguntas`,
                }
              : isDl957
              ? {
                  displayName: 'Código Procesal Penal (D.L. 957)',
                  categoria: 'Derecho Procesal Penal',
                  icon: Gavel,
                  color: 'teal',
                  descripcion:
                    'Atribuciones de la Policía, diligencias preliminares, flagrancia, detención, medidas cautelares, pruebas y desarrollo del juicio oral.',
                  imagen:
                    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
                  destacado: `${norma.totalPreguntas} Preguntas`,
                }
              : isUsoFuerza
              ? {
                  displayName: 'Uso de la Fuerza PNP (D.L. 1186)',
                  categoria: 'Uso de la Fuerza',
                  icon: Zap,
                  color: 'orange',
                  descripcion:
                    'Principios de legalidad, necesidad y proporcionalidad, niveles preventivos y reactivos, uso de armas de fuego y derechos policiales.',
                  imagen:
                    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
                  destacado: `${norma.totalPreguntas} Preguntas`,
                }
              : isTid
              ? {
                  displayName: 'Tráfico Ilícito de Drogas (D.L. 1241)',
                  categoria: 'Lucha contra TID',
                  icon: Ban,
                  color: 'rose',
                  descripcion:
                    'Interdicción, erradicación de cultivos ilegales, fiscalización de insumos químicos (SUNAT/DIGEMID), incautación y decomiso de bienes.',
                  imagen:
                    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
                  destacado: `${norma.totalPreguntas} Preguntas`,
                }
              : {
                  displayName: norma.nombre,
                  categoria: norma.grupo || 'Temario Oficial',
                  icon: FileText,
                  color: 'slate',
                  descripcion: `Reactivos oficiales para el proceso de ascenso PNP 2026.`,
                  imagen:
                    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
                  destacado: `${norma.totalPreguntas} Preguntas`,
                };

            const IconComp = cardInfo.icon;

            return (
              <div
                key={norma.id}
                className={`group relative bg-[#011a14] dark:bg-[#011a14] rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl flex flex-col ${
                  isSelected
                    ? `border-emerald-500 ring-1 ring-emerald-500/30`
                    : 'border-slate-800/40'
                }`}
              >
                {/* PARTE SUPERIOR: IMAGEN + CONTENIDO */}
                <div className="flex gap-4 p-4">
                  {/* IMAGEN DEL TEMA (Cuadrada con bordes suaves) */}
                  <div
                    onClick={() => handleToggleTema(norma.nombre)}
                    className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden relative bg-slate-900 cursor-pointer border border-slate-800"
                  >
                    <img
                      src={norma.imagen || cardInfo.imagen}
                      alt={cardInfo.displayName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center backdrop-blur-[1px]">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 drop-shadow-md" />
                      </div>
                    )}
                  </div>

                  {/* INFORMACIÓN: CATEGORÍA + TÍTULO */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`${p.badgeBg} ${p.badgeText} text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded`}>
                        {cardInfo.categoria}
                      </span>
                      <span className="bg-slate-800/60 text-slate-400 text-[9px] font-bold px-2 py-1 rounded border border-slate-700/50">
                        {cardInfo.destacado}
                      </span>
                    </div>

                    <h3
                      onClick={() => handleToggleTema(norma.nombre)}
                      className="font-sans font-bold text-white text-base sm:text-lg leading-tight cursor-pointer transition-colors group-hover:text-emerald-400 line-clamp-3"
                    >
                      {cardInfo.displayName}
                    </h3>
                  </div>
                </div>

                {/* BARRA DE ACCIONES (Fiel a la imagen de referencia) */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/50">
                    <div className="flex items-center gap-2">
                      {/* BOTÓN INFO */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isConstitucion) setShowConstitucionInfo(!showConstitucionInfo);
                          if (isDl1267) setShowDl1267Info(!showDl1267Info);
                          if (isDl1291) setShowDl1291Info(!showDl1291Info);
                          if (isLey27806) setShowLey27806Info(!showLey27806Info);
                          if (isLeyAscenso) setShowLeyAscensoInfo(!showLeyAscensoInfo);
                          if (isLey27444) setShowLey27444Info(!showLey27444Info);
                          if (isDl957) setShowDl957Info(!showDl957Info);
                          if (isUsoFuerza) setShowUsoFuerzaInfo(!showUsoFuerzaInfo);
                          if (isTid) setShowTidInfo(!showTidInfo);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:text-emerald-400 transition-colors"
                      >
                        <div className="flex items-center gap-0.5">
                          <Info className="w-4 h-4" />
                          <ChevronDown className={`w-3 h-3 transition-transform ${isDesgloseOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {/* BOTÓN ELEGIR */}
                      <button
                        type="button"
                        onClick={() => handleToggleTema(norma.nombre)}
                        className={`flex items-center gap-2 px-3 h-9 rounded-lg font-bold text-[10px] uppercase tracking-wide transition-all border ${
                          isSelected
                            ? `bg-emerald-500/10 text-emerald-400 border-emerald-500/50`
                            : 'bg-slate-800/20 text-slate-500 border-slate-700/50'
                        }`}
                      >
                        {isSelected ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                        <span>Elegir</span>
                      </button>
                    </div>

                    {/* BOTÓN DAR EXAMEN */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartSingleTemaExamen(norma.nombre);
                      }}
                      className={`flex items-center gap-2 px-4 h-9 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${p.iconBg} hover:brightness-110 shadow-lg shadow-black/20`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Dar Examen</span>
                    </button>
                  </div>

                  {/* DESGLOSE */}
                  {isDesgloseOpen && (
                    <div className="mt-3 pt-3 border-t border-slate-800/30 animate-fadeIn">
                      <div className="space-y-2">
                        {isConstitucion && (
                          <div className="grid grid-cols-1 gap-1.5">
                            <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800/50 text-[10px]">
                              <span className="text-emerald-400 font-bold block">FORMULARIO 1 (PREG. 1-25)</span>
                              <span className="text-slate-500">Derechos y Libertades Fundamentales</span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800/50 text-[10px]">
                              <span className="text-emerald-400 font-bold block">FORMULARIO 2 (PREG. 26-50)</span>
                              <span className="text-slate-500">Estado, Deberes, FF.AA. y PNP</span>
                            </div>
                          </div>
                        )}
                        {!isConstitucion && (
                          <div className="p-2 text-[10px] text-slate-500 italic">
                            Contenido organizado según balotario oficial 2026.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>
        {/* BOTÓN PRINCIPAL Y RESUMEN */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              Configuración de Evaluación:
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-300 uppercase">{selectedTemas.length} TEMAS</span>
              </div>
              <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase">{totalPreguntasSimulacro} REACTIVOS</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartSimulacro}
            disabled={preguntasDisponibles.length === 0}
            className={`w-full md:w-auto font-bold text-xs px-8 py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all uppercase tracking-widest ${
              preguntasDisponibles.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 active-scale cursor-pointer'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {preguntasDisponibles.length > 0
                ? `Iniciar Evaluación (${totalPreguntasSimulacro} Q)`
                : 'Seleccione Materias'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
