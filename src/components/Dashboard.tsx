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
  SlidersHorizontal,
  Zap,
  CheckCircle2,
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
}) => {
  const [filtroGrupo] = useState<'TODOS' | GrupoMateria>('TODOS');
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
      badgeColor: 'bg-emerald-600 text-white font-black',
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
      badgeColor: 'bg-[#059669] text-white font-black',
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
    <div className="space-y-6 pb-16 bg-[#01241a] text-slate-100 min-h-screen p-2 sm:p-4">
      {/* 1. CREDENCIAL INTERACTIVA DEL POSTULANTE */}
      <div className="bg-[#004d38] border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
          <Shield className="w-96 h-96 text-emerald-300" />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Fila superior: Grado, Nombre y Norma Oficial */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-600/50 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] text-emerald-200 uppercase tracking-widest bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-300" />
                <span>RD N° 006857-2026-DIRREHUM-PNP/JE</span>
              </span>
              <span className="font-mono text-xs text-white bg-emerald-900/80 border border-emerald-500/50 px-3 py-1 rounded-lg font-bold">
                Postulante: {userProfile.grado} {userProfile.nombre}
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-200 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-600/50">
              Promoción Ascenso <strong className="text-emerald-300">2026</strong>
            </span>
          </div>

          {/* Título y Resumen del Perfil */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-black text-white leading-tight">
                Preparación PNP
              </h1>
              <p className="text-[11px] sm:text-xs text-emerald-200/90 font-sans mt-0.5">
                Evaluación continua según temario oficial 2026.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowProfileStats(!showProfileStats)}
              className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 hover:bg-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-600 flex items-center gap-1.5 shrink-0 transition-all active-scale"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{showProfileStats ? 'Ocultar Avances' : 'Ver Avances'}</span>
              {showProfileStats ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* INDICADORES DE AVANCE */}
          {showProfileStats ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 animate-fadeIn">
              <button
                type="button"
                onClick={() => setSubTab('estadisticas')}
                className="bg-emerald-950/80 hover:bg-emerald-900/90 p-3 rounded-2xl border border-emerald-600/60 transition-all text-left group active-scale"
              >
                <span className="text-[10px] font-mono text-emerald-300/80 uppercase block">Nivel de Dominio</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-display font-black text-xl sm:text-2xl text-emerald-300">
                    {indicadorGlobal.porcentajeGlobal}%
                  </span>
                  <span className="text-[10px] font-mono text-emerald-200 font-bold truncate">
                    {indicadorGlobal.nivelLegible}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSubTab('normas')}
                className="bg-emerald-950/80 hover:bg-emerald-900/90 p-3 rounded-2xl border border-emerald-600/60 transition-all text-left group active-scale"
              >
                <span className="text-[10px] font-mono text-emerald-300/80 uppercase block">Banco Oficial</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-display font-black text-xl sm:text-2xl text-white">
                    1,500
                  </span>
                  <span className="text-[10px] font-mono text-emerald-200 font-bold">Preguntas</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSubTab('estadisticas')}
                className="bg-emerald-950/80 hover:bg-emerald-900/90 p-3 rounded-2xl border border-emerald-600/60 transition-all text-left group active-scale"
              >
                <span className="text-[10px] font-mono text-emerald-300/80 uppercase block">Simulacros Rendidos</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-display font-black text-xl sm:text-2xl text-emerald-300">
                    {historialIntentos.length}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-200 font-bold">Intentos</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onStartExamen('repaso')}
                className="bg-emerald-950/80 hover:bg-emerald-900/90 p-3 rounded-2xl border border-emerald-600/60 transition-all text-left group active-scale"
              >
                <span className="text-[10px] font-mono text-emerald-300/80 uppercase block font-bold">Por Repasar (SRS)</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-display font-black text-xl sm:text-2xl text-emerald-300">
                    {pendientesSRSCount}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-200 font-bold">
                    {pendientesSRSCount > 0 ? '▶ Reforzar hoy' : 'Al día'}
                  </span>
                </div>
              </button>
            </div>
          ) : (
            <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-600/60 flex items-center justify-between text-xs font-mono text-emerald-200">
              <div className="flex items-center gap-3">
                <span className="text-emerald-300 font-black">
                  Dominio: {indicadorGlobal.porcentajeGlobal}%
                </span>
                <span className="text-emerald-600">|</span>
                <span className="text-emerald-200">
                  Fallos: <strong className="text-emerald-300">{pendientesSRSCount}</strong>
                </span>
              </div>
              <span className="text-[10px] text-emerald-300/80 font-semibold">
                1,500 preguntas
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. CENTRO DE ENTRENAMIENTO */}
      <div className="flex flex-col gap-6">
        
        {/* NAVEGACIÓN DE MÓDULOS */}
        <div className="flex items-center gap-1.5 bg-[#003829] p-1.5 rounded-2xl border border-emerald-700/60 overflow-x-auto scrollbar-none sticky top-[72px] z-30 shadow-sm">
          <button
            type="button"
            onClick={() => setSubTab('simulacros')}
            className={`flex-1 min-w-[110px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display text-xs sm:text-sm transition-all active-scale ${
              subTab === 'simulacros'
                ? 'bg-white text-[#01241a] font-black shadow-md'
                : 'text-emerald-200 hover:text-white font-bold'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Simulacros</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('normas')}
            className={`flex-1 min-w-[110px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display text-xs sm:text-sm transition-all active-scale ${
              subTab === 'normas'
                ? 'bg-white text-[#01241a] font-black shadow-md'
                : 'text-emerald-200 hover:text-white font-bold'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Normas PNP</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('estadisticas')}
            className={`flex-1 min-w-[110px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display text-xs sm:text-sm transition-all active-scale ${
              subTab === 'estadisticas'
                ? 'bg-white text-[#01241a] font-black shadow-md'
                : 'text-emerald-200 hover:text-white font-bold'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Resultados</span>
          </button>
        </div>

        {subTab === 'simulacros' && (
          <div className="animate-fadeIn space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

              {/* 1. SIMULACRO OFICIAL 100 PREGUNTAS */}
              <div className="bg-[#004d38] border-2 border-emerald-500/80 rounded-2xl p-4 text-white flex flex-col justify-between gap-3 shadow-lg hover:border-emerald-400 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      ★ RECOMENDADO OFICIAL (100 PREG.)
                    </span>
                    <h3 className="font-display font-black text-lg text-white mt-2">
                      Simulacro Oficial
                    </h3>
                  </div>
                  <span className="text-emerald-300 text-xs font-mono font-bold flex items-center gap-1 shrink-0 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-600/50">
                    <Clock className="w-3.5 h-3.5 text-emerald-300" /> 180 min
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRequestOfficialSimulacro}
                  className="w-full bg-white hover:bg-emerald-50 text-[#01241a] font-display font-black py-3 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active-scale"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>INICIAR SIMULACRO OFICIAL</span>
                </button>
              </div>

              {/* 2. PRÁCTICA EXPRÉS */}
              <div className="bg-[#004d38] border border-emerald-700/60 rounded-2xl p-4 text-white flex flex-col justify-between gap-3 shadow-sm hover:border-emerald-500 transition-all">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[10px] font-mono font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        ENTRENAMIENTO RÁPIDO
                      </span>
                      <h3 className="font-display font-black text-base text-white mt-1.5">
                        Práctica Exprés
                      </h3>
                    </div>
                    <span className="text-emerald-300 text-xs font-mono font-bold flex items-center gap-1 shrink-0 bg-emerald-950 px-2 py-1 rounded-lg">
                      <Zap className="w-3.5 h-3.5" /> {numPreguntasRapido} preg.
                    </span>
                  </div>

                  {/* Selector de cantidad */}
                  <div className="mt-3">
                    <span className="text-[10px] font-mono text-emerald-200/80 block mb-1">
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
                              ? 'bg-white text-[#01241a] border-white font-black shadow-sm'
                              : 'bg-emerald-950 text-emerald-200 border-emerald-700/60 hover:bg-emerald-900'
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
                  className="w-full bg-[#059669] hover:bg-[#047857] text-white font-display font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active-scale"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-200" />
                  <span>INICIAR PRÁCTICA ({numPreguntasRapido} PREG.)</span>
                </button>
              </div>

              {/* 3. REPASAR ERRORES (SRS) */}
              <div className="bg-[#004d38] border border-emerald-700/60 rounded-2xl p-4 text-white flex flex-col justify-between gap-3 shadow-sm hover:border-emerald-500 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[10px] font-mono font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      REPASO DE FALLOS
                    </span>
                    <h3 className="font-display font-black text-base text-white mt-1.5">
                      Repasar Errores
                    </h3>
                  </div>
                  <span className="text-emerald-300 text-xs font-mono font-bold shrink-0 bg-emerald-950 px-2 py-1 rounded-lg">
                    {pendientesSRSCount} pend.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRequestRepasoExam}
                  disabled={pendientesSRSCount === 0}
                  className={`w-full font-display font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all ${
                    pendientesSRSCount > 0
                      ? 'bg-[#059669] hover:bg-[#047857] text-white shadow-md active-scale'
                      : 'bg-emerald-950 text-emerald-500/50 cursor-not-allowed border border-emerald-800'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>REPARAR ERRORES</span>
                </button>
              </div>

              {/* 4. POR NORMA O LEY */}
              <div className="bg-[#004d38] border border-emerald-700/60 rounded-2xl p-4 text-white flex flex-col justify-between gap-3 shadow-sm hover:border-emerald-500 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[10px] font-mono font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      POR BALOTARIO
                    </span>
                    <h3 className="font-display font-black text-base text-white mt-1.5">
                      Por Ley o Norma
                    </h3>
                  </div>
                  <span className="text-emerald-300 text-xs font-mono font-bold shrink-0 bg-emerald-950 px-2 py-1 rounded-lg">
                    1,500 preg.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSubTab('normas')}
                  className="w-full bg-white hover:bg-emerald-50 text-[#01241a] font-display font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active-scale"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>ELEGIR NORMA O LEY</span>
                </button>
              </div>

              {/* 5. SIMULACRO PERSONALIZADO */}
              <div className="bg-[#004d38] border border-emerald-700/60 rounded-2xl p-4 text-white flex flex-col justify-between gap-3 shadow-sm hover:border-emerald-500 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[10px] font-mono font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      PERSONALIZADO
                    </span>
                    <h3 className="font-display font-black text-base text-white mt-1.5">
                      Armar a Medida
                    </h3>
                  </div>
                  <span className="text-emerald-300 text-xs font-mono font-bold shrink-0 bg-emerald-950 px-2 py-1 rounded-lg">
                    Filtros
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('crear-simulacro')}
                  className="w-full bg-[#059669] hover:bg-[#047857] text-white font-display font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active-scale"
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
            <div className="bg-[#004d38] border border-emerald-700/60 rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-700/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white text-[#01241a] flex items-center justify-center shrink-0 shadow-lg font-black">
                    <BookOpen className="w-6 h-6 text-[#01241a]" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-xl uppercase tracking-tight text-white">Biblioteca de Normas 2026</h2>
                    <p className="text-xs text-emerald-200/80">Entrenamiento específico por materia legal.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-emerald-300 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={busquedaNorma}
                      onChange={(e) => setBusquedaNorma(e.target.value)}
                      placeholder="Buscar norma..."
                      className="w-full bg-[#003829] border border-emerald-600 text-xs text-white rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-emerald-400 font-sans placeholder-emerald-300/60"
                    />
                  </div>
                </div>
              </div>

              {/* Materias Rows */}
              <div className="divide-y divide-emerald-700/60 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                {materiasFiltradas.length === 0 ? (
                  <div className="text-center py-8 text-xs text-emerald-200/80">
                    No se encontraron materias que coincidan con la búsqueda.
                  </div>
                ) : (
                  materiasFiltradas.map((m, idx) => (
                    <div
                      key={idx}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#003829]/60 px-2.5 rounded-2xl transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase bg-emerald-950 text-emerald-300 border border-emerald-600/60">
                            {m.grupo}
                          </span>
                          <span className="text-xs text-emerald-200/80 font-mono">
                            {m.totalBanco} preguntas en banco
                          </span>
                        </div>
                        <h4 className="font-display text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                          {m.norma}
                        </h4>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                        <div className="w-36">
                          <div className="flex justify-between items-center text-xs font-mono mb-1">
                            <span className="text-emerald-200">{m.aciertos}/{m.totalRespondidas}</span>
                            <span className="font-bold text-emerald-300">
                              {m.porcentaje}%
                            </span>
                          </div>
                          <div className="w-full bg-emerald-950 h-2 rounded-full overflow-hidden border border-emerald-700/60">
                            <div
                              className="h-full transition-all duration-300 rounded-full bg-emerald-400"
                              style={{ width: `${Math.min(100, m.porcentaje)}%` }}
                            ></div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRequestNormaExam(m.norma)}
                          className="bg-white hover:bg-emerald-50 text-[#01241a] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 shrink-0 active-scale shadow-sm"
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
              <div className="bg-[#004d38] border border-emerald-700/60 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-emerald-300 uppercase tracking-wider font-bold">Nivel de Dominio</span>
                    <h3 className="font-display text-lg font-bold text-white mt-1">{indicadorGlobal.nivelLegible}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>
                <div className="my-5">
                  <div className="flex justify-between items-baseline mb-2 font-mono">
                    <span className="text-3xl font-black text-emerald-300">{indicadorGlobal.porcentajeGlobal}%</span>
                    <span className="text-xs text-emerald-200">{indicadorGlobal.totalCorrectas} / {indicadorGlobal.totalRespondidas}</span>
                  </div>
                  <div className="w-full bg-emerald-950 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, indicadorGlobal.porcentajeGlobal)}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-200/80 leading-snug">{indicadorGlobal.evaluacionTexto}</p>
              </div>

              <div className="bg-[#004d38] border border-emerald-700/60 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-emerald-300 uppercase tracking-wider font-bold">Racha Actual</span>
                    <h3 className="font-display text-lg font-bold text-white mt-1">Simulacros</h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <div className="my-5">
                  <div className="flex items-baseline gap-2 font-mono">
                    <span className="text-3xl font-black text-emerald-300">{indicadorGlobal.rachaActual}</span>
                    <span className="text-xs text-emerald-200 uppercase">Aprobados seguidos</span>
                  </div>
                </div>
                <button
                  onClick={() => setSubTab('simulacros')}
                  className="w-full bg-white hover:bg-emerald-50 text-[#01241a] font-display font-bold py-2.5 rounded-xl text-xs transition-all active-scale"
                >
                  Continuar Racha
                </button>
              </div>

              <div className="bg-[#004d38] border border-emerald-700/60 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-emerald-300 uppercase tracking-wider font-bold">Perfil CIP</span>
                    <h3 className="font-display text-lg font-bold text-white mt-1">{userProfile.nombre}</h3>
                  </div>
                  <div className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-black">CIP {userProfile.cip}</div>
                </div>
                <div className="mt-4 space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-2 border-b border-emerald-700/60">
                    <span className="text-emerald-200">Grado:</span>
                    <span className="font-black text-white">{userProfile.grado}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-emerald-700/60">
                    <span className="text-emerald-200">Plan:</span>
                    <span className="text-emerald-300 font-black">{userProfile.plan}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Historial de Intentos Recientes */}
            {historialIntentos.length > 0 && (
              <div className="bg-[#004d38] border border-emerald-700/60 rounded-3xl p-6 text-white shadow-xl space-y-4">
                <h3 className="font-display text-lg font-bold text-white border-b border-emerald-700/60 pb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-300" />
                  Historial de Evaluaciones
                </h3>

                <div className="divide-y divide-emerald-700/60">
                  {historialIntentos.slice(0, 10).map((intento) => {
                    const pct = Math.round((intento.aciertos / intento.totalPreguntas) * 100);
                    const aprobado = pct >= 65;
                    const mins = Math.floor(intento.duracionSeg / 60);
                    const secs = intento.duracionSeg % 60;

                    return (
                      <div key={intento.id} className="py-4 flex items-center justify-between gap-4 text-xs font-mono">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${aprobado ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-red-950 text-red-300 border border-red-500/40'}`}>
                              {aprobado ? 'APROBADO' : 'FALLIDO'}
                            </span>
                            <span className="text-emerald-200 font-bold truncate">
                              MODO: {intento.modo} {intento.normaFiltro ? `(${intento.normaFiltro})` : ''}
                            </span>
                          </div>
                          <p className="text-emerald-300/70 text-[10px]">
                            {new Date(intento.fecha).toLocaleDateString('es-PE')} · Duración: {mins}m {secs}s
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-base font-black block ${aprobado ? 'text-emerald-300' : 'text-red-400'}`}>
                            {intento.aciertos}/{intento.totalPreguntas}
                          </span>
                          <span className="text-[10px] text-emerald-200 font-bold">{pct}% ACIERTO</span>
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
