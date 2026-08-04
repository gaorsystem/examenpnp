import React, { useState } from 'react';
import {
  Shield,
  Clock,
  BookOpen,
  LayoutGrid,
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
  BarChart3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { UserProfile, IntentoExamen, DominioMateria, GrupoMateria } from '../types';
import { SimulacroInfoModal, ExamModalDetails } from './SimulacroInfoModal';

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
  const [showProfileStats, setShowProfileStats] = useState<boolean>(false);
  const [selectedExamDetails, setSelectedExamDetails] = useState<ExamModalDetails | null>(null);

  const materiasFiltradas = dominioMaterias.filter((m) => {
    const matchGrupo = filtroGrupo === 'TODOS' || m.grupo === filtroGrupo;
    const matchNorma = m.norma.toLowerCase().includes(busquedaNorma.toLowerCase());
    return matchGrupo && matchNorma;
  });

  const handleRequestOfficialSimulacro = () => {
    setSelectedExamDetails({
      mode: 'simulacro',
      title: 'Simulacro Real Oficial PNP 2026',
      badge: '★ 100 Preguntas / Examen Oficial',
      badgeColor: 'bg-amber-500 text-slate-950 font-black',
      finalidad: 'Medir tu nivel de preparación en un examen de 100 preguntas que replica fielmente la distribución por áreas, normas legales y temporizador del proceso de admisión/ascenso de la PNP.',
      comoFunciona: [
        'Responderás 100 preguntas seleccionadas de las 22 normas del temario oficial.',
        'Contarás con un temporizador continuo de 180 minutos con alerta visual.',
        'Al entregar el examen obtendrás tu nota oficial (0-100), hoja de claves y análisis de rendimiento.'
      ],
      preguntasCount: 100,
      tiempoEstimado: '180 minutos (3 Horas)',
      permiteAyudas: false,
      retroalimentacion: 'al_final',
      onConfirm: () => onStartExamen('simulacro', 100),
    });
  };

  const handleRequestExpresExam = (count: number) => {
    setSelectedExamDetails({
      mode: 'expres',
      title: `Práctica Exprés (${count} Preguntas)`,
      badge: '⚡ Entrenamiento Inmediato',
      badgeColor: 'bg-blue-500 text-white font-black',
      finalidad: 'Entrenar agilidad mental, responder preguntas clave en momentos libres y memorizar la base legal de cada respuesta al instante.',
      comoFunciona: [
        `El sistema seleccionará ${count} preguntas aleatorias del banco de 1,500 reactivos.`,
        'Al marcar cada respuesta sabrás de inmediato si acertaste o fallaste junto con el artículo sustentatorio.',
        'Tendrás disponibles las herramientas inteligentes: Profesor IA, Audio Voz y Comodín 50/50.'
      ],
      preguntasCount: count,
      tiempoEstimado: 'Sin límite de tiempo',
      permiteAyudas: true,
      retroalimentacion: 'instantanea',
      onConfirm: () => onStartExamen('expres', count),
    });
  };

  const handleRequestRepasoExam = () => {
    setSelectedExamDetails({
      mode: 'repaso',
      title: 'Repaso Inteligente de Fallos',
      badge: '🎯 Refuerzo de Fallos (SRS)',
      badgeColor: 'bg-emerald-500 text-white font-black',
      finalidad: 'Garantizar el 100% de dominio convirtiendo tus errores pasados en aciertos consolidados mediante repetición espaciada.',
      comoFunciona: [
        `Cargarás las ${pendientesSRSCount} preguntas en las que tuviste errores previamente.`,
        'Cada pregunta muestra la explicación legal para corregir conceptos dudosos.',
        'Al responder correctamente 2 veces consecutivas, la pregunta se registra como dominada.'
      ],
      preguntasCount: pendientesSRSCount,
      tiempoEstimado: 'Libre',
      permiteAyudas: true,
      retroalimentacion: 'instantanea',
      onConfirm: () => onStartExamen('repaso'),
    });
  };

  const handleRequestNormaExam = (normaNombre: string) => {
    setSelectedExamDetails({
      mode: 'norma',
      title: `Estudio Focalizado: ${normaNombre}`,
      badge: '📖 Dominio por Norma Legal',
      badgeColor: 'bg-amber-600 text-white font-black',
      finalidad: `Evaluación concentrada únicamente en las preguntas pertenecientes a la norma legal "${normaNombre}".`,
      comoFunciona: [
        'Se filtrarán solo los reactivos correspondientes a este cuerpo legal.',
        'Verás el artículo y norma legal en cada respuesta explicada.',
        'Ideal para consolidar leyes complejas como la Ley PNP, Código Penal o DDHH.'
      ],
      preguntasCount: 20,
      tiempoEstimado: 'Sin presión de reloj',
      permiteAyudas: true,
      retroalimentacion: 'instantanea',
      onConfirm: () => onStartExamen('norma', 20, normaNombre),
    });
  };

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
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-black text-white leading-tight">
                Mi Perfil de Preparación PNP
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-300 font-sans mt-0.5">
                Evaluación continua según temario oficial 2026.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowProfileStats(!showProfileStats)}
              className="text-xs font-mono font-bold text-amber-400 bg-slate-900/90 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 shrink-0 transition-all active-scale"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{showProfileStats ? 'Ocultar Avances' : 'Ver Avances'}</span>
              {showProfileStats ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* INDICADORES DE AVANCE (DESPLEGABLES / COMPACTOS) */}
          {showProfileStats ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 animate-fadeIn">
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
          ) : (
            <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-700/80 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-amber-400 font-black">
                  Dominio: {indicadorGlobal.porcentajeGlobal}%
                </span>
                <span className="text-slate-400 hidden sm:inline">|</span>
                <span className="text-slate-300 hidden sm:inline">
                  Intentos: {historialIntentos.length}
                </span>
                <span className="text-slate-400">|</span>
                <span className={pendientesSRSCount > 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  Fallos: {pendientesSRSCount}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                1,500 preguntas
              </span>
            </div>
          )}
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
          <div className="animate-fadeIn space-y-4">
            {/* GRILLA COMPACTA DE MODOS DE EVALUACIÓN Y PRÁCTICA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

              {/* 1. SIMULACRO OFICIAL 100 PREGUNTAS (OPCIÓN DESTACADA PRINCIPAL) */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 dark:from-slate-950 dark:to-slate-900 border-2 border-amber-500 rounded-2xl p-4 text-white flex flex-col justify-between gap-3 shadow-lg shadow-amber-500/10 hover:border-amber-400 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                      ★ RECOMENDADO OFICIAL (100 PREG.)
                    </span>
                    <h3 className="font-display font-black text-lg text-white mt-2">
                      Simulacro Oficial
                    </h3>
                  </div>
                  <span className="text-amber-400 text-xs font-mono font-bold flex items-center gap-1 shrink-0 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> 120 min
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRequestOfficialSimulacro}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black py-3 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active-scale border border-amber-300"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>INICIAR SIMULACRO OFICIAL</span>
                </button>
              </div>

              {/* 2. PRÁCTICA EXPRÉS / ENTRENAMIENTO (15, 30, 50, 100 PREGUNTAS) */}
              <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-white flex flex-col justify-between gap-3 shadow-sm hover:border-blue-500/50 transition-all">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        ENTRENAMIENTO RÁPIDO
                      </span>
                      <h3 className="font-display font-black text-base text-slate-900 dark:text-white mt-1.5">
                        Práctica Exprés
                      </h3>
                    </div>
                    <span className="text-blue-500 text-xs font-mono font-bold flex items-center gap-1 shrink-0 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg">
                      <Zap className="w-3.5 h-3.5" /> {numPreguntasRapido} preg.
                    </span>
                  </div>

                  {/* Selector de cantidad de preguntas */}
                  <div className="mt-3">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mb-1">
                      Cantidad de preguntas:
                    </span>
                    <div className="grid grid-cols-4 gap-1">
                      {[15, 30, 50, 100].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setNumPreguntasRapido(n)}
                          className={`py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                            numPreguntasRapido === n
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRequestExpresExam(numPreguntasRapido)}
                  className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-display font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active-scale"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>INICIAR PRÁCTICA ({numPreguntasRapido} PREG.)</span>
                </button>
              </div>

              {/* 3. REPASAR ERRORES (SRS) */}
              <div className={`border rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all ${
                pendientesSRSCount > 0
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                      pendientesSRSCount > 0
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      REPASO DE FALLOS
                    </span>
                    <h3 className="font-display font-black text-base text-slate-900 dark:text-white mt-1.5">
                      Repasar Errores
                    </h3>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold shrink-0 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg">
                    {pendientesSRSCount} pend.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRequestRepasoExam}
                  disabled={pendientesSRSCount === 0}
                  className={`w-full font-display font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all ${
                    pendientesSRSCount > 0
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active-scale'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>REPARAR ERRORES</span>
                </button>
              </div>

              {/* 4. POR NORMA O LEY */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-white flex flex-col justify-between gap-3 shadow-sm hover:border-amber-500/50 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      POR BALOTARIO
                    </span>
                    <h3 className="font-display font-black text-base text-slate-900 dark:text-white mt-1.5">
                      Por Ley o Norma
                    </h3>
                  </div>
                  <span className="text-slate-400 text-xs font-mono font-bold shrink-0 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg">
                    1,500 preg.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSubTab('normas')}
                  className="w-full bg-slate-100 dark:bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-display font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active-scale"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>ELEGIR NORMA O LEY</span>
                </button>
              </div>

              {/* 5. SIMULACRO PERSONALIZADO */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-white flex flex-col justify-between gap-3 shadow-sm hover:border-purple-500/50 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      PERSONALIZADO
                    </span>
                    <h3 className="font-display font-black text-base text-slate-900 dark:text-white mt-1.5">
                      Armar a Medida
                    </h3>
                  </div>
                  <span className="text-purple-500 text-xs font-mono font-bold shrink-0 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg">
                    Filtros
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('crear-simulacro')}
                  className="w-full bg-slate-100 dark:bg-slate-900 hover:bg-purple-600 hover:text-white text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-display font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active-scale"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>ARMAR MI SIMULACRO</span>
                </button>
              </div>

            </div>
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
                          onClick={() => handleRequestNormaExam(m.norma)}
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

      {/* Modal Popup Informativo al seleccionar un simulacro */}
      <SimulacroInfoModal
        isOpen={selectedExamDetails !== null}
        details={selectedExamDetails}
        onClose={() => setSelectedExamDetails(null)}
      />
    </div>
  );
};
