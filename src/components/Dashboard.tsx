import React, { useState } from 'react';
import {
  Shield,
  Clock,
  BookOpen,
  Search,
  Trophy,
  ArrowRight,
  Play,
  RotateCcw,
  Zap,
  CheckCircle2,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Layers,
  User
} from 'lucide-react';
import { UserProfile, IntentoExamen, DominioMateria, GrupoMateria } from '../types';
import { SimulacroInfoModal, ExamModalDetails } from './SimulacroInfoModal';
import { BANCO_PREGUNTAS } from '../data/questionsData';

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
}) => {
  const [filtroGrupo] = useState<'TODOS' | GrupoMateria>('TODOS');
  const [busquedaNorma, setBusquedaNorma] = useState('');
  const [subTab, setSubTab] = useState<'simulacros' | 'normas' | 'estadisticas'>('simulacros');
  const [showProfileStats, setShowProfileStats] = useState<boolean>(false);
  const [selectedExamDetails, setSelectedExamDetails] = useState<ExamModalDetails | null>(null);

  const materiasFiltradas = dominioMaterias.filter((m) => {
    const matchGrupo = filtroGrupo === 'TODOS' || m.grupo === filtroGrupo;
    const matchNorma = m.norma.toLowerCase().includes(busquedaNorma.toLowerCase());
    return matchGrupo && matchNorma;
  });

  const handleRequestRepasoExam = () => {
    setSelectedExamDetails({
      mode: 'repaso',
      title: 'Repaso Inteligente de Fallos',
      badge: '🎯 Refuerzo de Fallos (SRS)',
      badgeColor: 'bg-emerald-600 text-white font-black',
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
      badgeColor: 'bg-emerald-700 text-white font-black',
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
    <div className="space-y-6 pb-16 bg-[#F8FAFC] dark:bg-[#011611] text-slate-900 dark:text-slate-100 min-h-screen p-3 sm:p-6 transition-colors duration-300">
      {/* 1. CENTRO DE ENTRENAMIENTO (PRIORIDAD: SIMULACROS) */}
      <div className="flex flex-col gap-6">
        
        {/* NAVEGACIÓN DE MÓDULOS - Táctico Hud Style */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#02281e] p-2 rounded-2xl border border-slate-200 dark:border-emerald-800/20 overflow-x-auto scrollbar-none sticky top-[72px] z-30 shadow-sm transition-all">
          <button
            type="button"
            onClick={() => setSubTab('simulacros')}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display text-xs sm:text-sm transition-all active-scale ${
              subTab === 'simulacros'
                ? 'bg-emerald-600 text-white font-black shadow-lg shadow-emerald-600/20'
                : 'text-slate-500 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-emerald-900/20 font-bold'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span className="uppercase tracking-wider">Simulacros</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('normas')}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display text-xs sm:text-sm transition-all active-scale ${
              subTab === 'normas'
                ? 'bg-emerald-600 text-white font-black shadow-lg shadow-emerald-600/20'
                : 'text-slate-500 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-emerald-900/20 font-bold'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="uppercase tracking-wider">Leyes PNP</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('estadisticas')}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display text-xs sm:text-sm transition-all active-scale ${
              subTab === 'estadisticas'
                ? 'bg-emerald-600 text-white font-black shadow-lg shadow-emerald-600/20'
                : 'text-slate-500 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-emerald-900/20 font-bold'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="uppercase tracking-wider">Historial</span>
          </button>
        </div>

        {subTab === 'simulacros' && (
          <div className="animate-fadeIn space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* 1. SIMULACROS POR TEMA */}
              <div className="bg-white dark:bg-[#02281e] border-2 border-slate-100 dark:border-emerald-800/30 rounded-3xl p-6 flex flex-col justify-between gap-6 shadow-md hover:shadow-xl hover:border-emerald-500/30 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <Layers className="w-32 h-32 text-emerald-600" />
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border border-emerald-200/50 dark:border-emerald-800/50">
                      Evaluación Táctica
                    </span>
                  </div>
                  <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase leading-tight">
                    Simulacros por Temario
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-emerald-300/80 leading-relaxed font-medium">
                    Personaliza tu evaluación eligiendo temas específicos del balotario oficial 2026.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab('simulacro')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-display font-black py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-600/20 active-scale uppercase tracking-wider relative z-10"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>INGRESAR A SIMULACRO</span>
                </button>
              </div>

              {/* 2. REPASAR ERRORES (SRS) */}
              <div className="bg-white dark:bg-[#02281e] border-2 border-slate-100 dark:border-emerald-800/30 rounded-3xl p-6 flex flex-col justify-between gap-6 shadow-md hover:shadow-xl hover:border-emerald-500/30 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <RotateCcw className="w-32 h-32 text-emerald-600" />
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border border-emerald-200/50 dark:border-emerald-800/50">
                      Refuerzo Inteligente
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-mono font-black px-2.5 py-1 rounded-lg uppercase border border-slate-200 dark:border-slate-700">
                      {pendientesSRSCount} pendientes
                    </span>
                  </div>
                  <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase leading-tight">
                    Repasar Errores
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-emerald-300/80 leading-relaxed font-medium">
                    Enfócate exclusivamente en las preguntas que fallaste para consolidar tu nota de ascenso.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRequestRepasoExam}
                  disabled={pendientesSRSCount === 0}
                  className={`w-full font-display font-black py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-3 transition-all relative z-10 uppercase tracking-wider ${
                    pendientesSRSCount > 0
                      ? 'bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-400 text-white shadow-lg active-scale'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reparar Fallas</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {subTab === 'normas' && (
          <div className="animate-fadeIn space-y-6">
            <div className="bg-white dark:bg-[#02281e] border-2 border-slate-100 dark:border-emerald-800/20 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-emerald-800/10 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-2xl uppercase tracking-tight text-slate-900 dark:text-white">Biblioteca de Normas 2026</h2>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Entrenamiento específico por materia legal</p>
                  </div>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={busquedaNorma}
                    onChange={(e) => setBusquedaNorma(e.target.value)}
                    placeholder="Buscar norma o materia..."
                    className="w-full bg-slate-50 dark:bg-[#013326] border border-slate-200 dark:border-emerald-800/30 text-sm text-slate-700 dark:text-white rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Materias Rows */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-none">
                {materiasFiltradas.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 font-medium italic">
                    No se encontraron materias que coincidan con la búsqueda.
                  </div>
                ) : (
                  materiasFiltradas.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#013326]/20 border border-slate-100 dark:border-emerald-800/10 rounded-2xl hover:bg-white dark:hover:bg-[#02281e] hover:shadow-md hover:border-emerald-500/20 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-lg uppercase bg-white dark:bg-emerald-950 text-emerald-600 border border-slate-200 dark:border-emerald-800/50">
                            {m.grupo}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                            {m.totalBanco} REACTIVOS
                          </span>
                        </div>
                        <h4 className="font-display text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors leading-tight uppercase">
                          {m.norma}
                        </h4>
                      </div>

                      <div className="flex items-center gap-6 shrink-0">
                        <div className="w-32 hidden sm:block">
                          <div className="flex justify-between items-center text-[10px] font-black mb-1.5 uppercase tracking-tighter">
                            <span className="text-slate-400">{m.aciertos}/{m.totalRespondidas}</span>
                            <span className="text-emerald-600">
                              {m.porcentaje}% DOMINIO
                            </span>
                          </div>
                          <div className="w-full bg-slate-200/50 dark:bg-emerald-950 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all duration-500 rounded-full bg-emerald-500"
                              style={{ width: `${Math.min(100, m.porcentaje)}%` }}
                            ></div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRequestNormaExam(m.norma)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 active-scale shadow-sm shadow-emerald-600/10"
                        >
                          <span>Estudiar</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#02281e] border border-slate-200 dark:border-emerald-800/20 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Nivel de Dominio</span>
                    <h3 className="font-display text-xl font-black text-slate-900 dark:text-white mt-1 uppercase leading-tight">{indicadorGlobal.nivelLegible}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                    <Trophy className="w-6 h-6" />
                  </div>
                </div>
                <div className="my-6">
                  <div className="flex justify-between items-baseline mb-3 font-display">
                    <span className="text-4xl font-black text-emerald-600">{indicadorGlobal.porcentajeGlobal}%</span>
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-tighter">{indicadorGlobal.totalCorrectas} / {indicadorGlobal.totalRespondidas}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#013326] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(100, indicadorGlobal.porcentajeGlobal)}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-emerald-400/80 leading-relaxed font-medium italic">"{indicadorGlobal.evaluacionTexto}"</p>
              </div>

              <div className="bg-white dark:bg-[#02281e] border border-slate-200 dark:border-emerald-800/20 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Racha Actual</span>
                    <h3 className="font-display text-xl font-black text-slate-900 dark:text-white mt-1 uppercase leading-tight">Simulacros</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                    <Zap className="w-6 h-6 fill-current" />
                  </div>
                </div>
                <div className="my-6">
                  <div className="flex items-baseline gap-2 font-display">
                    <span className="text-5xl font-black text-emerald-600">{indicadorGlobal.rachaActual}</span>
                    <span className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest">Aprobados Seguidos</span>
                  </div>
                </div>
                <button
                  onClick={() => setSubTab('simulacros')}
                  className="w-full bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-display font-black py-3 rounded-xl text-xs transition-all active-scale uppercase tracking-widest"
                >
                  Continuar Racha
                </button>
              </div>

              <div className="bg-white dark:bg-[#02281e] border border-slate-200 dark:border-emerald-800/20 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Postulante CIP</span>
                    <h3 className="font-display text-xl font-black text-slate-900 dark:text-white mt-1 uppercase leading-tight truncate max-w-[180px]">{userProfile.nombre}</h3>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 border border-emerald-100 dark:border-emerald-800/50 text-[10px] px-3 py-1 rounded-lg font-mono font-black">CIP {userProfile.cip}</div>
                </div>
                <div className="mt-6 space-y-3 font-mono">
                  <div className="flex justify-between py-2.5 border-b border-slate-100 dark:border-emerald-800/10">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Grado Actual:</span>
                    <span className="text-xs font-black text-slate-800 dark:text-white">{userProfile.grado}</span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-slate-100 dark:border-emerald-800/10">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Plan Preparación:</span>
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">{userProfile.plan}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Historial de Intentos Recientes */}
            {historialIntentos.length > 0 && (
              <div className="bg-white dark:bg-[#02281e] border border-slate-200 dark:border-emerald-800/20 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="font-display text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-emerald-800/10 pb-4 flex items-center gap-3 uppercase tracking-tight">
                  <Clock className="w-6 h-6 text-emerald-600" />
                  Historial de Evaluaciones
                </h3>

                <div className="divide-y divide-slate-100 dark:divide-emerald-800/10">
                  {historialIntentos.slice(0, 10).map((intento) => {
                    const pct = Math.round((intento.aciertos / intento.totalPreguntas) * 100);
                    const aprobado = pct >= 65;
                    const mins = Math.floor(intento.duracionSeg / 60);
                    const secs = intento.duracionSeg % 60;

                    return (
                      <div key={intento.id} className="py-5 flex items-center justify-between gap-4">
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className={`px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest border ${aprobado ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                              {aprobado ? 'APROBADO' : 'FALLIDO'}
                            </span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight truncate">
                              {intento.modo} {intento.normaFiltro ? `— ${intento.normaFiltro}` : ''}
                            </span>
                          </div>
                          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                            {new Date(intento.fecha).toLocaleDateString('es-PE')} · TIE: {mins}m {secs}s
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-2xl font-black block leading-none font-display ${aprobado ? 'text-emerald-600' : 'text-red-500'}`}>
                            {intento.aciertos}/{intento.totalPreguntas}
                          </span>
                          <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-tighter">{pct}% EFICACIA</span>
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

      {/* 2. CREDENCIAL INTERACTIVA DEL POSTULANTE (POSICIONADA ABAJO) */}
      <div className="bg-white dark:bg-[#02281e] border-2 border-slate-100 dark:border-emerald-800/20 rounded-[32px] p-6 sm:p-10 shadow-xl relative overflow-hidden transition-all hover:border-emerald-500/20 group">
        <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
          <Shield className="w-[400px] h-[400px] text-emerald-600" />
        </div>

        <div className="relative z-10 space-y-8">
          {/* Fila superior: Grado, Nombre y Norma Oficial */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-emerald-800/10 pb-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 px-3 py-1.5 rounded-lg font-black flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>RD N° 006857-2026-DIRREHUM-PNP</span>
                </span>
                <span className="font-mono text-[10px] text-slate-500 dark:text-emerald-300 uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg font-black">
                  PROYECTO ASCENSO 2027
                </span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white uppercase leading-tight">
                {userProfile.grado} {userProfile.nombre}
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">CIP IDENTIFICACIÓN</p>
                <p className="text-xl font-display font-black text-emerald-600">{userProfile.cip || '00000000'}</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-emerald-900/40 border-2 border-white dark:border-emerald-800/50 shadow-inner flex items-center justify-center">
                <User className="w-8 h-8 text-slate-300 dark:text-emerald-700" />
              </div>
            </div>
          </div>

          {/* Título y Resumen del Perfil */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="font-display text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">
                Métricas de Preparación Táctica
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Evaluación continua según temario oficial 2026
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowProfileStats(!showProfileStats)}
              className="text-[10px] font-mono font-black text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 px-5 py-3 rounded-xl transition-all active-scale shadow-lg shadow-emerald-600/10 flex items-center gap-2 uppercase tracking-widest"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{showProfileStats ? 'Ocultar Panel' : 'Expandir Panel'}</span>
              {showProfileStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* INDICADORES DE AVANCE */}
          {showProfileStats ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
              <div className="bg-slate-50 dark:bg-[#013326] p-5 rounded-[24px] border border-slate-100 dark:border-emerald-800/10 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Dominio Global</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-3xl text-emerald-600">{indicadorGlobal.porcentajeGlobal}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-emerald-950 h-1 rounded-full mt-2">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${indicadorGlobal.porcentajeGlobal}%` }}></div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#013326] p-5 rounded-[24px] border border-slate-100 dark:border-emerald-800/10 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Banco Oficial</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-3xl text-slate-800 dark:text-white">{BANCO_PREGUNTAS.length}</span>
                  <span className="text-[10px] font-mono font-black text-slate-400 uppercase">Reactivos</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#013326] p-5 rounded-[24px] border border-slate-100 dark:border-emerald-800/10 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Simulacros</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-3xl text-slate-800 dark:text-white">{historialIntentos.length}</span>
                  <span className="text-[10px] font-mono font-black text-slate-400 uppercase">Completos</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartExamen('repaso')}
                className="bg-emerald-50 dark:bg-[#013326] p-5 rounded-[24px] border border-emerald-100 dark:border-emerald-800/20 space-y-2 hover:bg-emerald-100 transition-all text-left"
              >
                <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest font-black">Pendientes SRS</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-3xl text-emerald-600">{pendientesSRSCount}</span>
                  <span className="text-[10px] font-mono font-black text-emerald-700 uppercase">{pendientesSRSCount > 0 ? 'Urgent' : 'OK'}</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-[#013326] p-4 rounded-2xl border border-slate-100 dark:border-emerald-800/10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">DOMINIO</p>
                  <p className="text-sm font-display font-black text-emerald-600">{indicadorGlobal.porcentajeGlobal}% EFICAZ</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">FALLOS</p>
                  <p className="text-sm font-display font-black text-slate-800 dark:text-white">{pendientesSRSCount} CRÍTICOS</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono font-black text-emerald-600 uppercase tracking-widest">SISTEMA ACTIVO</p>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">2026-PNP-V1.4</p>
              </div>
            </div>
          )}
        </div>
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
