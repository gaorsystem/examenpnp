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
      {/* Banner Principal - Táctico Hud Style */}
      <div className="bg-white dark:bg-[#02281e] border-2 border-slate-100 dark:border-emerald-800/20 rounded-[32px] p-6 sm:p-10 shadow-sm relative overflow-hidden transition-all hover:border-emerald-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 px-3 py-1 rounded-lg text-[10px] font-mono font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Configuración de Evaluación Táctica</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">
              Simulacro por Temas
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Balotario Oficial PNP 2026</p>
          </div>

          <div className="bg-slate-50 dark:bg-[#013326] px-6 py-5 rounded-2xl border border-slate-100 dark:border-emerald-800/30 flex items-center gap-6 shrink-0 shadow-inner">
            <div className="text-right font-mono">
              <span className="block text-[10px] text-slate-400 uppercase font-black tracking-tighter">
                TEMAS SELECCIONADOS
              </span>
              <span className="text-2xl font-display font-black text-emerald-600">
                {selectedTemas.length} <span className="text-xs text-slate-300">/ {todasLasNormas.length}</span>
              </span>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-emerald-800/50"></div>
            <div className="text-right font-mono">
              <span className="block text-[10px] text-slate-400 uppercase font-black tracking-tighter">
                TOTAL REACTIVOS
              </span>
              <span className="text-2xl font-display font-black text-slate-900 dark:text-white">
                {preguntasDisponibles.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: SELECCIÓN DE TEMAS */}
      <div className="bg-white dark:bg-[#02281e] border border-slate-200 dark:border-emerald-800/20 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-emerald-800/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="font-display font-black text-xl text-slate-900 dark:text-white uppercase">
              Selección de Materias
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">
            Combina varios temas para un simulacro integral
          </p>
        </div>

        {/* LISTA DE TEMAS CON EL ESTILO DE LA CARTA */}
        <div className="bg-slate-50/50 dark:bg-[#013326]/10 p-2 sm:p-4 rounded-[32px] border border-slate-100 dark:border-emerald-800/10 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black font-mono uppercase tracking-[0.2em] text-slate-400">
              Malla Curricular Oficial 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          
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
                  descripcion:
                    'Interdicción, erradicación de cultivos ilegales, fiscalización de insumos químicos (SUNAT/DIGEMID), incautación y decomiso de bienes.',
                  imagen:
                    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
                  destacado: `${norma.totalPreguntas} Preguntas`,
                }
              : {
                  displayName: norma.nombre,
                  categoria: norma.grupo || 'Temario Oficial',
                  descripcion: `Reactivos oficiales para el proceso de ascenso PNP 2026.`,
                  imagen:
                    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
                  destacado: `${norma.totalPreguntas} Preguntas`,
                };

            return (
              <div
                key={norma.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md p-3 sm:p-4 ${
                  isSelected
                    ? `border-2 ${p.border} ring-2 ${p.ring} shadow-md ${p.bgCheck}`
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* CABECERA COMPACTA: THUMBNAIL + TÍTULO + BADGES */}
                <div className="flex items-start gap-3">
                  {/* IMAGEN THUMBNAIL COMPACTA */}
                  <div
                    onClick={() => handleToggleTema(norma.nombre)}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden relative bg-slate-100 dark:bg-slate-800 cursor-pointer group shadow-sm border border-slate-200/60 dark:border-slate-700/60"
                  >
                    <img
                      src={norma.imagen || cardInfo.imagen}
                      alt={cardInfo.displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                        <div className={`${p.iconBg} text-white p-1.5 rounded-full shadow-sm`}>
                          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* INFORMACIÓN DEL TEMA: BADGES + TÍTULO COMPLETO + DESCRIPCIÓN */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={`${p.badgeBg} ${p.badgeText} text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md`}>
                        {cardInfo.categoria}
                      </span>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                        {cardInfo.destacado}
                      </span>
                    </div>

                    <h3
                      onClick={() => handleToggleTema(norma.nombre)}
                      className={`font-display font-black text-slate-900 dark:text-white text-sm sm:text-base md:text-lg tracking-tight leading-snug cursor-pointer line-clamp-2 transition-colors ${p.hoverText}`}
                    >
                      {cardInfo.displayName}
                    </h3>

                    <p
                      onClick={() => handleToggleTema(norma.nombre)}
                      className="text-slate-500 dark:text-slate-300 text-[11px] sm:text-xs leading-relaxed font-sans cursor-pointer line-clamp-2 mt-1 hidden xs:block"
                    >
                      {cardInfo.descripcion}
                    </p>
                  </div>
                </div>

                {/* BARRA DE ACCIÓN INFERIOR COMPACTA Y HORIZONTAL */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Botón Ver temario */}
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
                      className={`text-[10px] sm:text-xs font-mono font-bold ${p.badgeText} flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg ${p.badgeBg} hover:opacity-80 transition-all active-scale`}
                    >
                      <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden xs:inline">{isDesgloseOpen ? 'Cerrar' : 'Temario'}</span>
                      {isDesgloseOpen ? (
                        <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      ) : (
                        <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      )}
                    </button>

                    {/* Botón Seleccionar para simulacro combinado */}
                    <button
                      type="button"
                      onClick={() => handleToggleTema(norma.nombre)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active-scale border shrink-0 ${
                        isSelected
                          ? `${p.badgeBg} ${p.badgeText} ${p.border}`
                          : `bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:${p.bgCheck} ${p.hoverText} border-slate-200 dark:border-slate-700`
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckSquare className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${p.badgeText}`} />
                          <span>Elegido</span>
                        </>
                      ) : (
                        <>
                          <Square className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                          <span>Elegir</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Botón Principal: DAR EXAMEN DIRECTO DE ESTE TEMA */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartSingleTemaExamen(norma.nombre);
                    }}
                    className={`text-white font-display font-black py-1.5 px-3 sm:px-5 rounded-lg text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0 whitespace-nowrap ${p.iconBg} hover:opacity-90`}
                  >
                    <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                    <span>Dar Examen</span>
                  </button>
                </div>

                {/* DESGLOSE DESPLEGADO DENTRO DE LA MISMA TARJETA */}
                {isDesgloseOpen && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                        {isConstitucion && (
                          <div className="space-y-2">
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-semibold">
                              100 preguntas oficiales organizadas por formulario:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 1 (Preg. 1 a la 25)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Derechos y Libertades Fundamentales (Art. 1 al 17)
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 2 (Preg. 26 a la 50)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Estado, Deberes, Ciudadanía, FF.AA. y PNP (Art. 22 al 44)
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 3 (Preg. 51 a la 72)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Régimen Constitucional y Función Pública (Art. 137 al 166)
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 4 (Preg. 73 a la 100)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Finalidad PNP, Régimen Educativo y Tributario (Art. 18 al 166)
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {isDl1267 && (
                          <div className="space-y-2">
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-semibold">
                              90 preguntas oficiales organizadas por formulario:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Form. 1 (Preg. 116-146)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Principios, valores, bienestar, atribuciones y obligaciones (Art. I a 25)
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Form. 2 (Preg. 147-170)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Funciones, personal civil, órganos de línea, uso fuerza (Art. 2 a 20)
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Form. 3 (Preg. 171-205)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Especialidades, comisarías, distintivos autoridad y mando (Art. 14 a 32)
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {isDl1291 && (
                          <div className="space-y-2">
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-semibold">
                              100 preguntas oficiales organizadas por formulario:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 1 (Preg. 316 a la 365)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Declaración Jurada, Control y Confianza, Polígrafo e Integridad Institucional
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 2 (Preg. 681 a la 730)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Prueba de Integridad, Rendición de Cuentas, Régimen Disciplinario e Incentivos
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {isLey27806 && (
                          <div className="space-y-2">
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-semibold">
                              60 preguntas oficiales organizadas por formulario:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 1 (Preg. 531 a la 564)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Acceso a la información, plazos oficiales, apelación, excepciones y obligaciones del MEF, OSCE y FONAFE
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 2 (Preg. 565 a la 590)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Transparencia en Sistema de Justicia, Declaraciones Juradas, Infracciones y Régimen Sancionador
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {isLeyAscenso && (
                          <div className="space-y-2">
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-semibold">
                              39 preguntas oficiales organizadas por formulario:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 1 (Preg. 608 a la 630)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Tiempos mínimos de servicios en el grado y en la institución para Oficiales y Suboficiales de Armas y Servicios (Art. 7 y 8)
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 2 (Preg. 591 a la 607)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Principios rectores (Igualdad, Imparcialidad, Objetividad, Transparencia), objeto de la ley, etapas y ascenso póstumo (Art. 1 al 6)
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {isLey27444 && (
                          <div className="space-y-2">
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-semibold">
                              120 preguntas oficiales organizadas por formulario:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 1 (Preg. 631 a la 670)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Nulidad de actos, principios del procedimiento, actos administrativos, fuentes, desistimiento y régimen de notificaciones
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 2 (Preg. 671 a la 710)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Recursos administrativos, plazos oficiales, requisitos de validez, notificaciones defectuosas y carga de la prueba
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 3 (Preg. 711 a la 750)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Actuaciones probatorias, medidas cautelares, órganos colegiados, conflictos de competencia y conservación del acto
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {isDl957 && (
                          <div className="space-y-2">
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-semibold">
                              170 preguntas oficiales organizadas en 4 formularios:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-[11px]">
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 1 (Preg. 751 a la 802)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Atribuciones PNP (Art. 68), control de identidad, pesquisas, registros, allanamiento, flagrancia y derechos del imputado
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 2 (Preg. 803 a la 842)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Prueba ilícita, principio acusatorio, funciones fiscales, actor civil, plazos de investigación y prisión preventiva
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 3 (Preg. 843 a la 880)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Etapa intermedia, sobreseimiento, medidas reales, intervenciones corporales, medios impugnatorios y exhibición de vestigios
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Formulario 4 (Preg. 881 a la 920)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Juicio oral, interrogatorio y contrainterrogatorio, alegatos de clausura, orden de exposiciones y declaración del imputado
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {isUsoFuerza && (
                          <div className="space-y-2">
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-semibold">
                              45 preguntas oficiales organizadas por contenido temático:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Principios y Definiciones (1091 - 1101)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Objeto, alcance, principio de legalidad, necesidad, proporcionalidad y medios de policía
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Niveles y Resistencia (1102 - 1122)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Resistencia pasiva (riesgo latente, no cooperador), resistencia activa, niveles preventivos y reactivos
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Armas de Fuego y Derechos (1123 - 1135)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Uso excepcional de arma de fuego, reportes post-intervención, asistencia médica, psicológica y legal del policía
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {isTid && (
                          <div className="space-y-2">
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-semibold">
                              45 preguntas oficiales organizadas por contenido temático:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Marco y Prevención (1136 - 1151)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Objeto, articulación DEVIDA/MININTER, fiscalización IQPF (SUNAT/MINSA) y neutralización de pistas clandestinas
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Cultivos y Erradicación (1152 - 1161)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Cuantificación y conteo, prohibición de coca no empadronada, destrucción in situ de amapola/marihuana y catastro
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                                <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                                  Incautación y Decomiso (1162 - 1180)
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-[10px]">
                                  Decomiso de drogas e IQPF, incautación de bienes (PRONABI, DIRAVPOL, Banco de la Nación) y actos de investigación
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
              </div>
            );
          })}
          </div>
        </div>
        {/* BOTÓN PRINCIPAL Y RESUMEN */}
        <div className="pt-8 border-t border-slate-100 dark:border-emerald-800/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left font-mono">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Configuración de Evaluación:
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase">{selectedTemas.length} TEMAS</span>
              </div>
              <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-black text-emerald-600 uppercase">{totalPreguntasSimulacro} REACTIVOS</span>
              </div>
            </div>
            <div className="text-[10px] font-bold text-slate-400 flex items-center justify-center md:justify-start gap-1.5 uppercase tracking-tighter">
              <Clock className="w-3.5 h-3.5 text-slate-300" />
              <span>Tiempo táctico asignado: <strong className="text-slate-600 dark:text-slate-300">{tiempoSugerido} MINUTOS</strong></span>
            </div>
          </div>

          <button
            onClick={handleStartSimulacro}
            disabled={preguntasDisponibles.length === 0}
            className={`w-full md:w-auto font-display font-black text-base px-10 py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all uppercase tracking-widest ${
              preguntasDisponibles.length > 0
                ? 'bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white shadow-emerald-600/10 active-scale cursor-pointer'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Play className="w-6 h-6 fill-current" />
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
