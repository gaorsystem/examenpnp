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

      {/* 2. CENTRO DE ENTRENAMIENTO PROFESIONAL (ORDEN LÓGICO) */}
      <div className="flex flex-col gap-6">
        
        {/* NAVEGACIÓN DE MÓDULOS - DISEÑO PROFESIONAL */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none sticky top-[72px] z-30 shadow-sm">
          <button
            type="button"
            onClick={() => setSubTab('simulacros')}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display text-xs sm:text-sm transition-all active-scale ${
              subTab === 'simulacros'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200 dark:border-slate-700 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Simulacros</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('normas')}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display text-xs sm:text-sm transition-all active-scale ${
              subTab === 'normas'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200 dark:border-slate-700 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Normas PNP</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('estadisticas')}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display text-xs sm:text-sm transition-all active-scale ${
              subTab === 'estadisticas'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200 dark:border-slate-700 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Resultados</span>
          </button>
        </div>

        {subTab === 'simulacros' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* PRIORIDAD 1: REPASO ADAPTATIVO (SRS) - SIEMPRE ARRIBA SI HAY PENDIENTES */}
            <div className={`rounded-3xl p-5 border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
              pendientesSRSCount > 0 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  pendientesSRSCount > 0 ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}>
                  <RotateCcw className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-black text-slate-900 dark:text-white leading-none">
                    {pendientesSRSCount > 0 ? 'Repaso de Fallos Pendiente' : 'Repaso al Día'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-1.5">
                    {pendientesSRSCount > 0 
                      ? `Tienes ${pendientesSRSCount} preguntas por reforzar según tu historial de errores.` 
                      : '¡Excelente! No tienes preguntas marcadas para repaso hoy.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onStartExamen('repaso')}
                disabled={pendientesSRSCount === 0}
                className={`w-full sm:w-auto font-display font-black py-3.5 px-8 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                  pendientesSRSCount > 0 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active-scale' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>REFORZAR FALLAS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* PRIORIDAD 2: SIMULACRO OFICIAL (EL GRAN RETO) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-500" />
                  Simulacro General 2026
                </h2>
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>120 MINUTOS</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden group shadow-xl">
                  <div className="relative z-10 space-y-5">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-mono font-black px-2.5 py-1 rounded-md shadow-sm">MODALIDAD OFICIAL PNP</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl sm:text-3xl font-display font-black leading-tight">Examen Completo de Ascenso</h3>
                      <p className="text-sm text-slate-300 font-sans max-w-lg leading-relaxed">
                        Ensayo de 100 preguntas reales seleccionadas aleatoriamente del banco oficial 2026. Incluye cronómetro y audio-lectura.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        onClick={() => onStartExamen('simulacro', 100)}
                        className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black py-4 px-10 rounded-2xl transition-all shadow-2xl active-scale flex items-center justify-center gap-3"
                      >
                        <Play className="w-6 h-6 fill-current" />
                        <span>EMPEZAR EXAMEN REAL</span>
                      </button>
                    </div>
                  </div>
                  <Shield className="absolute -right-16 -bottom-16 w-64 h-64 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 flex flex-col shadow-md">
                  <div className="space-y-2">
                    <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">Práctica Táctica</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Entrena con sesiones más cortas para reforzar agilidad mental en momentos libres.
                    </p>
                  </div>
                  <div className="space-y-4 pt-6 mt-auto">
                    <div className="grid grid-cols-3 gap-2">
                      {[10, 20, 50].map((num) => (
                        <button
                          key={num}
                          onClick={() => setNumPreguntasRapido(num)}
                          className={`py-2.5 rounded-xl text-xs font-mono font-black border transition-all ${
                            numPreguntasRapido === num
                              ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-amber-500/50'
                          }`}
                        >
                          {num} PREG.
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => onStartExamen('simulacro', numPreguntasRapido)}
                      className="w-full bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-display font-bold py-4 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 active-scale"
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>INICIAR SESIÓN ({numPreguntasRapido})</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* PRIORIDAD 3: ENTRENAMIENTO ESPECÍFICO (OTROS MÉTODOS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setSubTab('normas')}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 hover:border-amber-500 transition-all flex items-center gap-5 group shadow-sm text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-display font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Biblioteca por Norma</h4>
                  <p className="text-[11px] text-slate-500 font-sans mt-1">Practica una de las 22 leyes específicas PNP.</p>
                </div>
              </button>
              
              <button 
                onClick={() => onNavigateTab('crear-simulacro')}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 hover:border-amber-500 transition-all flex items-center gap-5 group shadow-sm text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <SlidersHorizontal className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-display font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Filtro Personalizado</h4>
                  <p className="text-[11px] text-slate-500 font-sans mt-1">Elige temas específicos y crea tu propio examen.</p>
                </div>
              </button>
            </div>

            {/* BARRA DE ASISTENTE (INFO EXTRA) */}
            {onOpenExplainer && (
              <button
                onClick={onOpenExplainer}
                className="w-full bg-amber-500/5 border-2 border-dashed border-amber-500/20 rounded-3xl p-6 hover:bg-amber-500/10 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-slate-900 dark:text-white">¿Cómo funciona el Audio y WhatsApp?</h5>
                    <p className="text-[11px] text-slate-500 font-sans">Aprende a usar el dictado por voz y los simulacros por WhatsApp.</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-600 underline underline-offset-4">Ver Tutorial</span>
              </button>
            )}
          </div>
        )}

        {subTab === 'normas' && (
          <div className="animate-fadeIn space-y-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-xl uppercase tracking-tight">Biblioteca de Normas 2026</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Entrenamiento específico por materia legal.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={busquedaNorma}
                      onChange={(e) => setBusquedaNorma(e.target.value)}
                      placeholder="Buscar norma..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-amber-500 font-sans"
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
          <div className="animate-fadeIn space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-md flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Nivel de Dominio</span>
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-1">{indicadorGlobal.nivelLegible}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-500">
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>
                <div className="my-5">
                  <div className="flex justify-between items-baseline mb-2 font-mono">
                    <span className="text-3xl font-black text-amber-600 dark:text-amber-400">{indicadorGlobal.porcentajeGlobal}%</span>
                    <span className="text-xs text-slate-500">{indicadorGlobal.totalCorrectas} / {indicadorGlobal.totalRespondidas}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, indicadorGlobal.porcentajeGlobal)}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{indicadorGlobal.evaluacionTexto}</p>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-md flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Racha Actual</span>
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-1">Simulacros</h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/40 flex items-center justify-center text-orange-500">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <div className="my-5">
                  <div className="flex items-baseline gap-2 font-mono">
                    <span className="text-3xl font-black text-orange-600 dark:text-orange-400">{indicadorGlobal.rachaActual}</span>
                    <span className="text-xs text-slate-500 uppercase">Aprobados seguidos</span>
                  </div>
                </div>
                <button
                  onClick={() => setSubTab('simulacros')}
                  className="w-full bg-slate-900 dark:bg-slate-700 text-white font-display font-bold py-2.5 rounded-xl text-xs transition-all active-scale"
                >
                  Continuar Racha
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-md flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Perfil CIP</span>
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-1">{userProfile.nombre}</h3>
                  </div>
                  <div className="bg-amber-500/10 text-amber-600 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-black">CIP {userProfile.cip}</div>
                </div>
                <div className="mt-4 space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Grado:</span>
                    <span className="font-black">{userProfile.grado}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Plan:</span>
                    <span className="text-emerald-600 font-black">{userProfile.plan}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Historial de Intentos Recientes */}
            {historialIntentos.length > 0 && (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-xl space-y-4">
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Historial de Evaluaciones
                </h3>

                <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {historialIntentos.slice(0, 10).map((intento) => {
                    const pct = Math.round((intento.aciertos / intento.totalPreguntas) * 100);
                    const aprobado = pct >= 65;
                    const mins = Math.floor(intento.duracionSeg / 60);
                    const secs = intento.duracionSeg % 60;

                    return (
                      <div key={intento.id} className="py-4 flex items-center justify-between gap-4 text-xs font-mono">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${aprobado ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                              {aprobado ? 'APROBADO' : 'FALLIDO'}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 font-bold truncate">
                              MODO: {intento.modo} {intento.normaFiltro ? `(${intento.normaFiltro})` : ''}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[10px]">
                            {new Date(intento.fecha).toLocaleDateString('es-PE')} · Duración: {mins}m {secs}s
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-base font-black block ${aprobado ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}`}>
                            {intento.aciertos}/{intento.totalPreguntas}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">{pct}% ACIERTO</span>
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
    </div>
  );
};
