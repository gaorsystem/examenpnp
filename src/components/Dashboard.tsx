import React, { useState } from 'react';
import {
  Shield,
  Clock,
  BookOpen,
  Search,
  Trophy,
  AlertTriangle,
  ArrowRight,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Volume2,
  Zap,
  Target,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { UserProfile, IntentoExamen, DominioMateria, GrupoMateria } from '../types';

interface DashboardProps {
  userProfile: UserProfile;
  indicadorGlobal: {
    porcentajeGlobal: number;
    totalRespondidas: number;
    totalCorrectas: number;
    rachaActual: number;
    evaluacionTexto: string;
    nivelLegible: string;
  };
  dominioMaterias: DominioMateria[];
  pendientesSRSCount: number;
  historialIntentos: IntentoExamen[];
  onStartExamen: (modo: 'simulacro' | 'repaso' | 'norma' | 'expres' | 'whatsapp', numPreguntas?: number, normaNombre?: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenExplainer?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  indicadorGlobal,
  dominioMaterias,
  pendientesSRSCount,
  historialIntentos,
  onStartExamen,
  onNavigateTab,
  onOpenExplainer,
}) => {
  const [filtroGrupo, setFiltroGrupo] = useState<'TODOS' | GrupoMateria>('TODOS');
  const [busquedaNorma, setBusquedaNorma] = useState('');
  const [numPreguntasRapido, setNumPreguntasRapido] = useState<number>(20);
  const [subTab, setSubTab] = useState<'simulacros' | 'normas' | 'estadisticas'>('simulacros');

  const materiasFiltradas = dominioMaterias.filter((m) => {
    const matchGrupo = filtroGrupo === 'TODOS' || m.grupo === filtroGrupo;
    const matchNorma = m.norma.toLowerCase().includes(busquedaNorma.toLowerCase());
    return matchGrupo && matchNorma;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* 1. CREDENCIAL INTERACTIVA DEL POSTULANTE & ACCESO INMEDIATO (OPTIMIZADO MÓVIL Y PC) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden glow-gold">
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
          <Shield className="w-96 h-96 text-amber-400" />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Fila superior: Grado, Nombre y Norma Oficial */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] text-amber-400 uppercase tracking-widest bg-amber-500/15 border border-amber-500/50 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>RD N° 006857-2026-DIRREHUM-PNP/JE</span>
              </span>
              <span className="font-mono text-xs text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-lg font-bold">
                Postulante: {userProfile.grado} {userProfile.nombre}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-300 bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700">
              Promoción Ascenso <strong className="text-amber-400">2026</strong>
            </span>
          </div>

          {/* Título y Resumen del Perfil */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
                Mi Perfil de Preparación PNP
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1">
                Toca cualquier indicador para revisar tus estadísticas o empieza un simulacro oficial en 1 clic:
              </p>
            </div>
          </div>

          {/* 4 INDICADORES INTERACTIVOS DEL POSTULANTE (TOCABLES EN MÓVIL) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setSubTab('estadisticas')}
              className="bg-slate-900/90 hover:bg-slate-800/90 p-3 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all text-left group active-scale"
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Nivel de Dominio</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-display font-black text-xl sm:text-2xl text-amber-400">
                  {indicadorGlobal.porcentajeGlobal}%
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold truncate">
                  {indicadorGlobal.nivelLegible}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('normas')}
              className="bg-slate-900/90 hover:bg-slate-800/90 p-3 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all text-left group active-scale"
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Banco Oficial</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-display font-black text-xl sm:text-2xl text-white">
                  1,500
                </span>
                <span className="text-[10px] font-mono text-slate-300 font-bold">Preguntas</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('estadisticas')}
              className="bg-slate-900/90 hover:bg-slate-800/90 p-3 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all text-left group active-scale"
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Simulacros Rendidos</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-display font-black text-xl sm:text-2xl text-blue-400">
                  {historialIntentos.length}
                </span>
                <span className="text-[10px] font-mono text-slate-300 font-bold">Intentos</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onStartExamen('repaso')}
              className={`p-3 rounded-2xl border transition-all text-left group active-scale ${
                pendientesSRSCount > 0
                  ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/60 shadow-sm'
                  : 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-700'
              }`}
            >
              <span className="text-[10px] font-mono text-emerald-300 uppercase block font-bold">Por Repasar (SRS)</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-display font-black text-xl sm:text-2xl text-emerald-400">
                  {pendientesSRSCount}
                </span>
                <span className="text-[10px] font-mono text-emerald-300 font-bold">
                  {pendientesSRSCount > 0 ? '▶ Reforzar hoy' : 'Al día'}
                </span>
              </div>
            </button>
          </div>

          {/* BARRA DE LANZAMIENTO RÁPIDO EN 1 CLIC (IDEAL PARA MÓVIL) */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-extrabold mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>Acceso Rápido desde tu Móvil / PC (1 Clic):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => onStartExamen('simulacro', 100)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active-scale"
              >
                <Play className="w-4 h-4 fill-current shrink-0" />
                <span>Simulacro Oficial (100)</span>
              </button>

              <button
                type="button"
                onClick={() => onStartExamen('simulacro', 20)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-display font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-slate-600 shadow-sm active-scale"
              >
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Práctica Exprés (20 preg.)</span>
              </button>

              <button
                type="button"
                onClick={() => onStartExamen('repaso')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm active-scale"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>Repasar Falladas ({pendientesSRSCount})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NAVEGADOR ORDENADO DE 3 PESTAÑAS (CERO SATURACIÓN EN MÓVIL Y PC) */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-md">
        <button
          type="button"
          onClick={() => setSubTab('simulacros')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3.5 px-3 rounded-xl font-display font-bold text-xs sm:text-sm transition-all active-scale ${
            subTab === 'simulacros'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
          }`}
        >
          <Target className="w-4 h-4 shrink-0" />
          <span>1. Iniciar Simulacro</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('normas')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3.5 px-3 rounded-xl font-display font-bold text-xs sm:text-sm transition-all active-scale ${
            subTab === 'normas'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>2. Las 22 Normas PNP</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('estadisticas')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3.5 px-3 rounded-xl font-display font-bold text-xs sm:text-sm transition-all active-scale ${
            subTab === 'estadisticas'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
          }`}
        >
          <BarChart3 className="w-4 h-4 shrink-0" />
          <span>3. Mis Estadísticas</span>
        </button>
      </div>

      {subTab === 'simulacros' && (
      <div className="space-y-6">
      {/* 2. BARRA DE ORIENTACIÓN: CÓMO COMENZAR (PASO A PASO) */}
      <div className="bg-amber-500/10 dark:bg-amber-500/5 border-2 border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="font-display font-black text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wide">
            ¿CÓMO EMPEZAR TU PREPARACIÓN HOY? (GUÍA DE 3 PASOS)
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm font-sans">
          <div className="bg-white dark:bg-slate-800/90 border border-amber-500/20 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center shrink-0">1</span>
              <strong className="text-slate-900 dark:text-white font-display text-sm">Elige tu Modo de Examen</strong>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              En la sección de abajo, escoge entre <strong>Simulacro Oficial (100 preg.)</strong>, <strong>Examen Rápido</strong> o <strong>Simulacro Personalizado</strong>.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800/90 border border-amber-500/20 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center shrink-0">2</span>
              <strong className="text-slate-900 dark:text-white font-display text-sm">Escucha las Preguntas en Voz Alta</strong>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Durante cualquier examen, puedes pulsar <strong>"Audio-Lectura"</strong> para escuchar la pregunta y sus alternativas en tu celular o PC.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800/90 border border-amber-500/20 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center shrink-0">3</span>
              <strong className="text-slate-900 dark:text-white font-display text-sm">Repasa lo que Fallaste</strong>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              El algoritmo guarda tus errores automáticamente. Vuelve aquí para rendir un <strong>Repaso Adaptativo</strong> solo de tus preguntas pendientes.
            </p>
          </div>
        </div>
      </div>

      {/* 3. SECCIÓN PRINCIPAL: SELECCIÓN TÁCTIL DE SIMULACROS (OPTIMIZADO MÓVIL) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-3">
          <div>
            <span className="font-mono text-xs text-amber-600 dark:text-amber-400 uppercase tracking-widest font-extrabold">
              PASO 1: SELECCIONA TU EVALUACIÓN
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
              <Target className="w-6 h-6 text-amber-500" />
              ¿Qué tipo de simulacro deseas rendir?
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Toca cualquier modalidad para iniciar al instante en tu celular o PC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* OPCIÓN 1: SIMULACRO OFICIAL PNP 100 PREGUNTAS */}
          <div className="bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-white dark:to-slate-800 border-2 border-amber-500 rounded-3xl p-5 hover:border-amber-400 transition-all shadow-lg flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-mono text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              MÁS RECOMENDADO
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase block">
                    FORMATO OFICIAL
                  </span>
                  <h3 className="font-display font-black text-lg text-slate-900 dark:text-white leading-tight">
                    Simulacro Oficial PNP
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans mb-4">
                Examen de <strong>100 preguntas</strong> (50 Comunes y 50 Especialidad) idéntico al día de la evaluación de ascenso. Con cronómetro de 120 minutos.
              </p>

              <div className="bg-slate-100 dark:bg-slate-900/80 rounded-xl p-2.5 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1 mb-4">
                <div className="flex justify-between">
                  <span>Preguntas:</span>
                  <strong className="text-amber-600 dark:text-amber-400">100 reales</strong>
                </div>
                <div className="flex justify-between">
                  <span>Duración:</span>
                  <strong>120 minutos</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartExamen('simulacro', 100)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg active-scale"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>INICIAR SIMULACRO (100)</span>
            </button>
          </div>

          {/* OPCIÓN 2: EXAMEN RÁPIDO O EXPRÉS (CON SELECTOR TÁCTIL MÓVIL) */}
          <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-5 hover:border-amber-500 transition-all shadow-md flex flex-col justify-between group">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                    PRÁCTICA DIARIA
                  </span>
                  <h3 className="font-display font-black text-lg text-slate-900 dark:text-white leading-tight">
                    Examen Rápido
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans mb-3">
                Ideal para practicar desde el móvil en cualquier momento libre. Elige con un toque la cantidad:
              </p>

              {/* 3 BOTONES TÁCTILES PARA SELECCIONAR CANTIDAD EN MÓVIL SIN DESPLEGABLE */}
              <div className="grid grid-cols-3 gap-1.5 mb-4">
                {[10, 20, 50].map((cant) => (
                  <button
                    key={cant}
                    type="button"
                    onClick={() => setNumPreguntasRapido(cant)}
                    className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all border ${
                      numPreguntasRapido === cant
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-extrabold'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-500/50'
                    }`}
                  >
                    {cant} preg.
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/80 rounded-xl p-2.5 text-xs font-mono text-slate-700 dark:text-slate-300 flex justify-between items-center mb-4">
                <span>Tiempo est.:</span>
                <strong className="text-amber-600 dark:text-amber-400">{numPreguntasRapido} minutos</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartExamen('simulacro', numPreguntasRapido)}
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-display font-bold py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow active-scale"
            >
              <Play className="w-4 h-4 fill-current text-amber-400" />
              <span>INICIAR EXAMEN ({numPreguntasRapido})</span>
            </button>
          </div>

          {/* OPCIÓN 3: CREAR EXAMEN PERSONALIZADO */}
          <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-5 hover:border-amber-500 transition-all shadow-md flex flex-col justify-between group">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase block">
                    A TU MEDIDA
                  </span>
                  <h3 className="font-display font-black text-lg text-slate-900 dark:text-white leading-tight">
                    Personalizado por Temas
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans mb-4">
                ¿Quieres estudiar únicamente Derecho Constitucional, Ley PNP o Derechos Humanos? Elige las normas exactas y la duración.
              </p>

              <div className="bg-slate-50 dark:bg-slate-900/80 rounded-xl p-2.5 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1 mb-4">
                <div className="flex justify-between">
                  <span>Temas:</span>
                  <strong className="text-blue-600 dark:text-blue-400">1 a 22 normas</strong>
                </div>
                <div className="flex justify-between">
                  <span>Modo:</span>
                  <strong>Estudio o examen</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('crear-simulacro')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-display font-bold py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow active-scale"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>CREAR PERSONALIZADO</span>
            </button>
          </div>

          {/* OPCIÓN 4: REPASO ADAPTATIVO SRS */}
          <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-5 hover:border-emerald-500 transition-all shadow-md flex flex-col justify-between group">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">
                    ALGORITMO SRS
                  </span>
                  <h3 className="font-display font-black text-lg text-slate-900 dark:text-white leading-tight">
                    Repaso de Falladas
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans mb-4">
                Practica únicamente las preguntas en las que cometiste errores o tuviste dudas. El algoritmo prioriza reforzar tus puntos débiles.
              </p>

              <div className="bg-slate-50 dark:bg-slate-900/80 rounded-xl p-2.5 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1 mb-4">
                <div className="flex justify-between items-center">
                  <span>Pendientes hoy:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 text-base">{pendientesSRSCount}</strong>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Método:</span>
                  <span>Repetición Espaciada</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartExamen('repaso')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow active-scale"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REPASAR FALLADAS ({pendientesSRSCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. BANNER INFORMATIVO: ASISTENTE WHATSAPP & AUDIO EN VOZ ALTA */}
      {onOpenExplainer && (
        <div
          onClick={onOpenExplainer}
          className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-slate-900/10 dark:to-slate-900/80 border-2 border-amber-500/50 hover:border-amber-400 rounded-3xl p-5 sm:p-6 cursor-pointer transition-all active-scale shadow-lg group flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
              <Volume2 className="w-7 h-7" />
            </div>
            <div>
              <span className="bg-amber-500 text-slate-950 font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider">
                TECNOLOGÍA EN TU PREPARACIÓN PNP
              </span>
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white mt-1 group-hover:text-amber-400 transition-colors">
                ¿Cómo funciona la Audio-Lectura en Voz Alta y el Bot de WhatsApp?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans mt-0.5">
                Haz clic aquí para probar el sintetizador neuronal de voz y los comandos para tu teléfono móvil.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="w-full sm:w-auto bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs px-6 py-3.5 rounded-2xl shadow transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <span>PROBAR EN VIVO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
      </div>
      )}

      {subTab === 'estadisticas' && (
      <div className="space-y-6">
      {/* 5. SECCIÓN #2: TUS ESTADÍSTICAS DEL POSTULANTE */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-extrabold">
              PASO 2: SEGUIMIENTO DE TU RENDIMIENTO
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
              <BarChart3 className="w-6 h-6 text-amber-500" />
              Tus Estadísticas y Perfil de Ascenso
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Global Readiness Score */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-5 text-slate-900 dark:text-slate-100 shadow-md flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                  Preparación Global
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {indicadorGlobal.nivelLegible}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-500">
                <Trophy className="w-5 h-5" />
              </div>
            </div>

            <div className="my-4">
              <div className="flex justify-between items-baseline mb-1 font-mono">
                <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                  {indicadorGlobal.porcentajeGlobal}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {indicadorGlobal.totalCorrectas} / {indicadorGlobal.totalRespondidas} preg.
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, indicadorGlobal.porcentajeGlobal)}%` }}
                ></div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-snug">
              {indicadorGlobal.evaluacionTexto}
            </p>
          </div>

          {/* SRS Pending Reviews */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-5 text-slate-900 dark:text-slate-100 shadow-md flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                  Estado del Repaso SRS
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Preguntas a Reforzar
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
                <RotateCcw className="w-5 h-5" />
              </div>
            </div>

            <div className="my-4">
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                  {pendientesSRSCount}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  preguntas en tu lista hoy
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-sans">
                El algoritmo guarda tus errores automáticamente para repasar justo a tiempo.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onStartExamen('repaso')}
              className="w-full bg-slate-900 dark:bg-slate-900 hover:bg-slate-800 text-white dark:hover:bg-slate-700 border border-slate-700 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all active-scale"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              Iniciar Repaso SRS
            </button>
          </div>

          {/* User Rank Card & Streak */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-5 text-slate-900 dark:text-slate-100 shadow-md flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                  Datos de Postulación
                </span>
                <h3 className="font-display text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {userProfile.grado} {userProfile.nombre}
                </h3>
              </div>
              <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-mono font-bold">
                CIP: {userProfile.cip}
              </div>
            </div>

            <div className="my-4 space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/80">
                <span className="text-slate-500 dark:text-slate-400">Racha de Aprobados:</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">{indicadorGlobal.rachaActual} simulacros</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700/80">
                <span className="text-slate-500 dark:text-slate-400">Meta Diaria:</span>
                <span className="text-slate-900 dark:text-white font-bold">{userProfile.metaPreguntasDiarias} preguntas</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">Plan Actual:</span>
                <span className="uppercase text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {userProfile.plan} (Acceso Total)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('banco')}
              className="w-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all active-scale"
            >
              <Search className="w-3.5 h-3.5 text-amber-500" />
              Explorar Banco Total (1,500)
            </button>
          </div>
        </div>
      </div>
      </div>
      )}

      {subTab === 'normas' && (
      <div className="space-y-6">
      {/* 6. SECCIÓN #3: DOMINIO POR NORMA OFICIAL (22 NORMAS) */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-xl space-y-4 pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-4">
          <div>
            <span className="font-mono text-xs text-amber-600 dark:text-amber-400 uppercase tracking-widest font-extrabold">
              PASO 3: PRÁCTICA ESPECÍFICA POR NORMA
            </span>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
              <BookOpen className="w-5 h-5 text-amber-500" />
              Banco Oficial por Materia y Norma (22 Fuentes PNP)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Haz clic en <strong>"Practicar"</strong> al costado de cualquier norma para evaluar únicamente preguntas de esa ley o reglamento.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Group */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => setFiltroGrupo('TODOS')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filtroGrupo === 'TODOS' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Todos (22)
              </button>
              <button
                type="button"
                onClick={() => setFiltroGrupo('COMUNES')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filtroGrupo === 'COMUNES' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Comunes
              </button>
              <button
                type="button"
                onClick={() => setFiltroGrupo('ESPECIALIDAD')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filtroGrupo === 'ESPECIALIDAD' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Especialidad
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={busquedaNorma}
                onChange={(e) => setBusquedaNorma(e.target.value)}
                placeholder="Filtrar norma..."
                className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-amber-500 font-sans w-40"
              />
            </div>
          </div>
        </div>

        {/* Materias Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
          {materiasFiltradas.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400">
              No se encontraron materias que coincidan con la búsqueda.
            </div>
          ) : (
            materiasFiltradas.map((m, idx) => (
              <div
                key={idx}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 px-2.5 rounded-2xl transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase ${
                        m.grupo === 'COMUNES'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {m.grupo}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {m.totalBanco} preguntas en banco
                    </span>
                  </div>
                  <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                    {m.norma}
                  </h4>
                </div>

                {/* Progress Bar & Buttons */}
                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                  <div className="w-36">
                    <div className="flex justify-between items-center text-xs font-mono mb-1">
                      <span className="text-slate-500 dark:text-slate-400">{m.aciertos}/{m.totalRespondidas}</span>
                      <span className={`font-bold ${m.porcentaje >= 70 ? 'text-emerald-600 dark:text-emerald-400' : m.porcentaje >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                        {m.porcentaje}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          m.porcentaje >= 70 ? 'bg-emerald-500' : m.porcentaje >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, m.porcentaje)}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStartExamen('norma', 15, m.norma)}
                    className="bg-slate-100 hover:bg-amber-500 hover:text-slate-950 dark:bg-slate-900 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1 shrink-0 active-scale"
                  >
                    <span>Practicar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
      )}

      {subTab === 'estadisticas' && (
      <div className="space-y-6">
      {/* 7. Historial de Intentos Recientes */}
      {historialIntentos.length > 0 && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-xl space-y-4">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Historial de Simulacros Rendidos
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {historialIntentos.slice(0, 5).map((intento) => {
              const pct = Math.round((intento.aciertos / intento.totalPreguntas) * 100);
              const aprobado = pct >= 65;
              const mins = Math.floor(intento.duracionSeg / 60);
              const secs = intento.duracionSeg % 60;

              return (
                <div key={intento.id} className="py-3 flex items-center justify-between gap-4 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md font-bold uppercase ${aprobado ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' : 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30'}`}>
                        {aprobado ? 'APROBADO' : 'REQUIERE REPASO'}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 uppercase">
                        Modo: {intento.modo} {intento.normaFiltro ? `(${intento.normaFiltro})` : ''}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Fecha: {new Date(intento.fecha).toLocaleString('es-PE')} · Tiempo: {mins}m {secs}s
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400 block">
                      {intento.aciertos} / {intento.totalPreguntas}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{pct}% de acierto</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>
      )}
    </div>
  );
};
