import React, { useState } from 'react';
import { Shield, Clock, BookOpen, Search, Trophy, AlertTriangle, ArrowRight, Play, CheckCircle2, RotateCcw, Filter, HelpCircle, SlidersHorizontal, Volume2, MessageSquare } from 'lucide-react';
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
  const [numPreguntasSimulacro, setNumPreguntasSimulacro] = useState<number>(20);

  const materiasFiltradas = dominioMaterias.filter((m) => {
    const matchGrupo = filtroGrupo === 'TODOS' || m.grupo === filtroGrupo;
    const matchNorma = m.norma.toLowerCase().includes(busquedaNorma.toLowerCase());
    return matchGrupo && matchNorma;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-amber-500/40 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden glow-gold">
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
          <Shield className="w-96 h-96 text-amber-400" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/40 px-2.5 py-0.5 rounded-md font-bold">
              RD N° 006857-2026-DIRREHUM-PNP/JE · Banco Oficial
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-extrabold text-white leading-tight">
            Panel de Rendimiento PNP 2026
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans">
            Plataforma evaluativa oficial con las <strong className="text-white">1,500 preguntas del balotario</strong> para el concurso de ascenso de Suboficiales de Armas y Servicios (Promoción 2027). Seguimiento de dominio en tiempo real por cada fuente normativa.
          </p>

          <div className="pt-3 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-700/80">
              <span className="font-mono text-amber-400 font-extrabold text-lg">1,500</span>
              <span className="text-xs text-slate-300 uppercase font-mono font-semibold">Preguntas Reales</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-700/80">
              <span className="font-mono text-amber-400 font-extrabold text-lg">22</span>
              <span className="text-xs text-slate-300 uppercase font-mono font-semibold">Normas Oficiales</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-700/80">
              <span className="font-mono text-amber-400 font-extrabold text-lg">50 / 50</span>
              <span className="text-xs text-slate-300 uppercase font-mono font-semibold">Comunes · Especialidad</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Readiness & Target Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Global Readiness Score */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-5 text-slate-900 dark:text-slate-100 shadow-md flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                Nivel de Preparación Global
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
                {indicadorGlobal.totalCorrectas} / {indicadorGlobal.totalRespondidas} preguntas
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
                Repaso Adaptativo SRS
              </span>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                Preguntas Pendientes
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {pendientesSRSCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                preguntas a repasar hoy
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-sans">
              Algoritmo SM-2 de repetición espaciada: prioriza preguntas falladas y normas con bajo rendimiento.
            </p>
          </div>

          <button
            onClick={() => onStartExamen('repaso')}
            className="w-full bg-slate-900 dark:bg-slate-900 hover:bg-slate-800 text-white dark:hover:bg-slate-700 border border-slate-700 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all active-scale"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            Iniciar Repaso Dirigido
          </button>
        </div>

        {/* User Rank Card & Streak */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-5 text-slate-900 dark:text-slate-100 shadow-md flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                Perfil del Postulante
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
            onClick={() => onNavigateTab('banco')}
            className="w-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all active-scale"
          >
            <Search className="w-3.5 h-3.5 text-amber-500" />
            Buscar en Banco (1,500)
          </button>
        </div>
      </div>

      {/* INTERACTIVE AUDIO & WHATSAPP BOT EXPLAINER BANNER FOR PORTAL */}
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
                Haz clic aquí para probar el sintetizador neuronal de voz y los comandos para tu teléfono.
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

      {/* Mode Selectors */}
      <div className="space-y-3">
        <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          Modos de Evaluación y Simulacro
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 0: Armar Simulacro Personalizado */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-900/5 dark:to-slate-900/80 border-2 border-amber-500/60 rounded-3xl p-5 hover:border-amber-400 transition-all group flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-amber-500 text-slate-950 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-md tracking-wide">
                  PERSONALIZADO
                </span>
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Arma tu Propio Simulacro
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-sans">
                Elige temas específicos, número de preguntas y tiempo para armar tu examen a la medida.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-500/20">
              <button
                onClick={() => onNavigateTab('crear-simulacro')}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow active-scale"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Configurar mi Examen
              </button>
            </div>
          </div>

          {/* Card 1: Simulacro Real */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-5 hover:border-amber-500 transition-all group flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-amber-500 text-slate-950 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-md tracking-wide">
                  CRONOMETRADO
                </span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Simulacro Real
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-sans">
                Mezcla equitativa (50% Comunes / 50% Especialidad) con cronómetro y expediente oficial.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-mono">
                <span>Cantidad:</span>
                <select
                  value={numPreguntasSimulacro}
                  onChange={(e) => setNumPreguntasSimulacro(Number(e.target.value))}
                  className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-amber-400 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-0.5 font-bold focus:outline-none"
                >
                  <option value={20}>20 Preguntas (20 min)</option>
                  <option value={50}>50 Preguntas (50 min)</option>
                  <option value={100}>100 Preguntas (120 min)</option>
                </select>
              </div>

              <button
                onClick={() => onStartExamen('simulacro', numPreguntasSimulacro)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow active-scale"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Iniciar Simulacro
              </button>
            </div>
          </div>

          {/* Card 2: Repaso Dirigido SRS */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-5 hover:border-amber-500 transition-all group flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-md tracking-wide">
                  SRS · ADAPTATIVO
                </span>
                <BookOpen className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Repaso Dirigido
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-sans">
                Prioriza las preguntas que fallaste anteriormente con retroalimentación y citas normativas.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/80">
              <button
                onClick={() => onStartExamen('repaso')}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-900 text-white font-mono font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow active-scale"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                Repasar ({pendientesSRSCount})
              </button>
            </div>
          </div>

          {/* Card 3: Examen Expres 10 min */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-5 hover:border-amber-500 transition-all group flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-md tracking-wide">
                  10 PREGUNTAS
                </span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Práctica Exprés
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-sans">
                Evaluación rápida de 10 preguntas para resolver en cualquier momento libre durante el turno.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/80">
              <button
                onClick={() => onStartExamen('expres', 10)}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-mono font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active-scale"
              >
                <Play className="w-3.5 h-3.5 text-amber-500" />
                Modo Exprés
              </button>
            </div>
          </div>

          {/* Card 4: Bot WhatsApp */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-5 hover:border-amber-500 transition-all group flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-md tracking-wide border border-emerald-500/30">
                  WHATSAPP BOT
                </span>
                <Shield className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Entrenamiento Bot
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-sans">
                Simula el entrenamiento automatizado por WhatsApp con explicaciones pedagógicas.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/80">
              <button
                onClick={() => onNavigateTab('whatsapp')}
                className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-mono font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active-scale"
              >
                Abrir Chat Bot
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger of Mastery by Norm / Materia */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" />
              Dominio por Materia y Norma (22 Fuentes Normativas)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Estado de avance y porcentaje de aciertos acumulados en el banco oficial
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Group */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1 text-xs font-mono">
              <button
                onClick={() => setFiltroGrupo('TODOS')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filtroGrupo === 'TODOS' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Todos (22)
              </button>
              <button
                onClick={() => setFiltroGrupo('COMUNES')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filtroGrupo === 'COMUNES' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Comunes
              </button>
              <button
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
                    onClick={() => onStartExamen('norma', 15, m.norma)}
                    className="bg-slate-100 hover:bg-amber-500 hover:text-slate-950 dark:bg-slate-900 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1 shrink-0 active-scale"
                  >
                    Practicar
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Historial de Intentos Recientes */}
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
  );
};
