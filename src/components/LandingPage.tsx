import React, { useState } from 'react';
import {
  Shield,
  Play,
  BookOpen,
  Volume2,
  Smartphone,
  CheckCircle2,
  Clock,
  Award,
  Zap,
  FileText,
  Lock,
  Sparkles,
  ArrowRight,
  Search,
  HelpCircle,
  RotateCcw,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { BANCO_PREGUNTAS } from '../data/questionsData';
import { AudioButton } from './AudioButton';

interface LandingPageProps {
  onStartSimulacro: (modo: 'simulacro' | 'expres' | 'repaso' | 'norma') => void;
  onNavigateTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartSimulacro,
  onNavigateTab,
}) => {
  // Sample Question State for Interactive Landing Demo Widget
  const [sampleQuestionIndex, setSampleQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const sampleQuestion = BANCO_PREGUNTAS[sampleQuestionIndex % BANCO_PREGUNTAS.length];

  const handleNextSample = () => {
    setSelectedOption(null);
    setSampleQuestionIndex((prev) => (prev + 1) % BANCO_PREGUNTAS.length);
  };

  const isCorrect = selectedOption?.trim() === sampleQuestion.respuesta.trim();

  return (
    <div className="space-y-8 pb-16">
      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-10 text-slate-100 shadow-2xl overflow-hidden text-center sm:text-left glow-gold">
        {/* Background Decorative Emblem */}
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none hidden md:block">
          <Shield className="w-96 h-96 text-amber-400" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Official Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 text-amber-400 px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wide shadow-md">
            <Shield className="w-4 h-4 shrink-0 text-amber-400" />
            <span>RD N° 006857-2026-DIRREHUM-PNP/JE — BALOTARIO OFICIAL</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black leading-none text-white tracking-tight">
            Simulador de Ascenso <span className="text-amber-400 drop-shadow-md">PNP 2026</span>
            <span className="block text-xl sm:text-2xl lg:text-3xl font-bold text-slate-300 mt-2 italic font-serif">
              Promoción 2027 · Suboficiales de Armas y Servicios
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl">
            Preparación de alto rendimiento con las <strong className="text-white font-bold">1,500 preguntas oficiales</strong> de las 22 normas del balotario oficial. Practica con voz hablada, repaso inteligente SRS y simulador de WhatsApp.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-extrabold text-base sm:text-lg px-8 py-4 rounded-2xl shadow-2xl transition-all active-scale flex items-center justify-center gap-3 border-2 border-amber-300 group"
            >
              <Shield className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
              <span>INGRESAR AL PORTAL DEL POSTULANTE</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateTab('crear-simulacro')}
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/50 font-mono font-bold text-xs sm:text-sm px-6 py-4 rounded-2xl transition-all active-scale flex items-center justify-center gap-2 shadow"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Armar Mi Propio Simulacro</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-slate-300 border-t border-slate-700/60">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1,500 Preguntas</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <span>22 Normas Legales</span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Audio Voz Integrado</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-sky-400 shrink-0" />
              <span>100% Móvil Táctil</span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE DEMO WIDGET — DEMO VIVA INTERACTIVA DE PREGUNTA EN LANDING */}
      <div className="bg-white dark:bg-slate-800 border-2 border-amber-500/40 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30 inline-block mb-1">
              DEMOSTRACIÓN INTERACTIVA VIVA
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-amber-500" />
              Prueba una Pregunta del Banco Oficial Ahora
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <AudioButton
              textToRead={`Pregunta de muestra. Norma: ${sampleQuestion.norma}. ${sampleQuestion.enunciado}. Alternativas: ${sampleQuestion.opciones.map((op, i) => `Opción ${String.fromCharCode(65 + i)}: ${op}`).join('. ')}`}
              label="Escuchar Pregunta"
              size="sm"
            />
            <button
              onClick={handleNextSample}
              className="bg-slate-100 dark:bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1 active-scale"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>Cambiar Pregunta</span>
            </button>
          </div>
        </div>

        {/* Question Header Badge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="bg-slate-100 dark:bg-slate-900 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded font-bold">
            CÓDIGO: {sampleQuestion.id}
          </span>
          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded font-bold uppercase">
            {sampleQuestion.norma}
          </span>
        </div>

        {/* Question Enunciado */}
        <p className="font-display font-semibold text-base sm:text-lg text-slate-900 dark:text-white leading-relaxed">
          {sampleQuestion.enunciado}
        </p>

        {/* Options Grid */}
        <div className="space-y-2 pt-2">
          {sampleQuestion.opciones.map((op, opIdx) => {
            const letra = String.fromCharCode(65 + opIdx);
            const isSelected = selectedOption === op;
            const isRight = op.trim() === sampleQuestion.respuesta.trim();

            let optionStyle =
              'bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';

            if (selectedOption !== null) {
              if (isRight) {
                optionStyle =
                  'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-500 font-bold ring-2 ring-emerald-500/50';
              } else if (isSelected) {
                optionStyle = 'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200 border-red-500 font-bold';
              }
            }

            return (
              <button
                key={opIdx}
                onClick={() => setSelectedOption(op)}
                className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-sans transition-all flex items-start gap-3 active-scale ${optionStyle}`}
              >
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold text-sm bg-amber-500/10 w-6 h-6 rounded flex items-center justify-center shrink-0 border border-amber-500/30">
                  {letra}
                </span>
                <span className="flex-1 leading-snug pt-0.5">{op}</span>
                {selectedOption !== null && isRight && (
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                )}
                {selectedOption !== null && isSelected && !isRight && (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Rationale Feedback if Answered */}
        {selectedOption !== null && (
          <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-slate-900 border-amber-500/40 space-y-2 animate-fadeIn text-xs font-mono">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                    ¡CORRECTO MI OFICIAL! Base Legal Oficial Confirmada
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 dark:text-red-300 font-bold text-sm">
                    INCORRECTO — La clave oficial es: {sampleQuestion.respuesta}
                  </span>
                </>
              )}
            </div>

            {sampleQuestion.ubicacion && (
              <p className="text-slate-600 dark:text-slate-300 text-[11px] pt-1 border-t border-slate-200 dark:border-slate-800">
                <strong>Ubicación en el Reglamento:</strong> {sampleQuestion.ubicacion}
              </p>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onStartSimulacro('simulacro')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold px-4 py-2 rounded-xl text-xs shadow flex items-center gap-1.5 active-scale"
              >
                <span>Rendir Examen Completo (20 preguntas)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3 CORE DIFFERENTIATORS / CARACTERÍSTICAS CLAVE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-amber-500 rounded-3xl p-5 text-slate-900 dark:text-slate-100 space-y-3 shadow-md transition-all active-scale">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Algoritmo Repetición Espaciada (SRS)</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            Basado en la curva del olvido. El sistema detecta exactamente en qué artículos fallas y te los vuelve a presentar en el momento exacto para garantizar retención a largo plazo.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-amber-500 rounded-3xl p-5 text-slate-900 dark:text-slate-100 space-y-3 shadow-md transition-all active-scale">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-500">
            <Volume2 className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Audio-Lectura en Voz Alta</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            Ideal para estudiar mientras patrullas, caminas o te desplazas. Presiona el botón de altavoz en cualquier pregunta y escucha la lectura clara de la pregunta y alternativas.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-amber-500 rounded-3xl p-5 text-slate-900 dark:text-slate-100 space-y-3 shadow-md transition-all active-scale">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-500">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">WhatsApp Bot de Estudio Diario</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            Simulador interactivo vía WhatsApp. Recibe tu pregunta del día directamente a tu celular, responde con un toque y mantén tu racha de estudio sin cambiar de app.
          </p>
        </div>
      </div>

      {/* QUICK ACCESS MODES GRID */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-3">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Modalidades de Estudio Rápido
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Selecciona tu forma preferida de práctica para hoy</p>
          </div>
          <span className="font-mono text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 font-bold self-start sm:self-auto">
            100% Optimizado para Celular
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Mod 1 */}
          <button
            onClick={() => onStartSimulacro('simulacro')}
            className="bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-amber-500 p-5 rounded-2xl text-left transition-all space-y-3 group active-scale shadow-sm"
          >
            <div className="flex justify-between items-center text-amber-500">
              <Clock className="w-6 h-6" />
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">Simulacro Tipo Examen</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              20 preguntas con cronómetro oficial (20 min). 50% Comunes / 50% Especialidad.
            </p>
          </button>

          {/* Mod 2 */}
          <button
            onClick={() => onNavigateTab('repaso')}
            className="bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-amber-500 p-5 rounded-2xl text-left transition-all space-y-3 group active-scale shadow-sm"
          >
            <div className="flex justify-between items-center text-amber-500">
              <Zap className="w-6 h-6" />
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">Repaso Inteligente SRS</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Refuerza las preguntas en las que has fallado o tienes menor porcentaje de aciertos.
            </p>
          </button>

          {/* Mod 3 */}
          <button
            onClick={() => onNavigateTab('normas')}
            className="bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-amber-500 p-5 rounded-2xl text-left transition-all space-y-3 group active-scale shadow-sm"
          >
            <div className="flex justify-between items-center text-emerald-500">
              <BookOpen className="w-6 h-6" />
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">Práctica por Norma Legal</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Filtra y practica por norma específica (Código Penal, Régimen Disciplinario, etc.).
            </p>
          </button>

          {/* Mod 4 */}
          <button
            onClick={() => onNavigateTab('banco')}
            className="bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-amber-500 p-5 rounded-2xl text-left transition-all space-y-3 group active-scale shadow-sm"
          >
            <div className="flex justify-between items-center text-sky-500">
              <Search className="w-6 h-6" />
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">Buscador y Catálogo</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Busca las 1,500 preguntas por palabra clave, código PNP o número de ley.
            </p>
          </button>
        </div>
      </div>

      {/* NORMATIVA LEGAL & GRUPOS INCLUIDOS */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 space-y-4 shadow-xl">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
          Estructura del Temario Oficial (RD N° 006857-2026-DIRREHUM-PNP/JE)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Comunes */}
          <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-emerald-500/40 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                MATERIAS COMUNES (750 Preguntas)
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">10 Normas</span>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 pt-1 font-sans">
              <li>• Ley N° 1267 — Ley de la Policía Nacional del Perú</li>
              <li>• DL N° 1186 — Uso de la Fuerza por la PNP</li>
              <li>• Ley N° 30714 — Régimen Disciplinario de la PNP</li>
              <li>• Código Penal Decreto Legislativo N° 635</li>
              <li>• Código Procesal Penal Decreto Legislativo N° 957</li>
              <li>• Declaración Universal de los Derechos Humanos</li>
            </ul>
          </div>

          {/* Especialidad */}
          <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-red-500/40 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30">
                MATERIAS DE ESPECIALIDAD (750 Preguntas)
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">12 Normas</span>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 pt-1 font-sans">
              <li>• DL N° 1268 — Régimen Disciplinario PNP</li>
              <li>• Manual de Procedimientos Operativos Policiales</li>
              <li>• Ley N° 30364 — Prevención y sanción de violencia familiar</li>
              <li>• Ley N° 30077 — Ley contra el Crimen Organizado</li>
              <li>• Código de Ejecución Penal y Reglamentos PNP</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FINAL CTA FOOTER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-10 text-center space-y-4 shadow-2xl glow-gold">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
          ¿Listo para asegurar tu ascenso a la siguiente jerarquía?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-sans">
          Inicia tu ensayo cronometrado ahora. Las preguntas son idénticas al balotario oficial del Concurso de Ascenso 2026.
        </p>

        <div className="pt-2">
          <button
            onClick={() => onStartSimulacro('simulacro')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-base sm:text-lg px-9 py-4 rounded-2xl shadow-2xl transition-all border-2 border-amber-200 inline-flex items-center gap-3 active-scale"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>INGRESAR AL SIMULACRO VIVO AHORA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
