import React, { useState } from 'react';
import {
  Shield,
  Play,
  MessageSquare,
  CheckCircle2,
  Volume2,
  Smartphone,
  ArrowRight,
  HelpCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { BANCO_PREGUNTAS } from '../data/questionsData';
import { AudioButton } from './AudioButton';

interface LandingPageProps {
  onStartSimulacro: (modo: 'simulacro' | 'expres' | 'repaso' | 'norma') => void;
  onNavigateTab: (tab: string) => void;
  onOpenExplainer?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartSimulacro,
  onNavigateTab,
  onOpenExplainer,
}) => {
  // Estado para una muestra rápida y limpia de 1 pregunta (sin saturar)
  const [sampleQuestionIndex, setSampleQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const sampleQuestion = BANCO_PREGUNTAS[sampleQuestionIndex % BANCO_PREGUNTAS.length];

  const handleNextSample = () => {
    setSelectedOption(null);
    setSampleQuestionIndex((prev) => (prev + 1) % BANCO_PREGUNTAS.length);
  };

  const isCorrect = selectedOption?.trim() === sampleQuestion.respuesta.trim();

  // Enlace directo para contratar por WhatsApp
  const wspLink =
    'https://wa.me/51987654321?text=Hola,%20deseo%20contratar%20el%20Servicio%20del%20Simulador%20de%20Ascenso%20PNP%202026%20(Balotario%201,500%20preguntas)%20y%20activar%20mi%20acceso.';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* 1. SECCIÓN PRINCIPAL LIMPIA Y DIRECCIONAL (CERO SATURACIÓN) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden text-center">
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none hidden sm:block">
          <Shield className="w-80 h-80 text-amber-400" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
          {/* Badge Oficial - Hidden on mobile to save space */}
          <div className="hidden sm:inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/50 text-amber-400 px-4 py-1.5 rounded-full text-xs font-mono font-extrabold tracking-wide">
            <Shield className="w-4 h-4 shrink-0 text-amber-400" />
            <span>RD N° 006857-2026-DIRREHUM-PNP/JE · BALOTARIO 2026</span>
          </div>

          {/* Título simple y contundente */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-white tracking-tight">
            Simulador Ascenso <span className="text-amber-400">PNP 2026</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans px-2">
            Balotario oficial de <strong className="text-white">1,500 preguntas</strong> para el concurso de ascenso. Practica en tu móvil con audio y simulacros reales.
          </p>

          {/* 3 puntos resumidos - Optimized for both Mobile and PC */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono text-slate-300 pt-1">
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>1,500 Preguntas</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Audio Voz</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700">
              <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
              <span>Repaso SRS</span>
            </span>
          </div>

          {/* 2 BOTONES PRINCIPALES - Focus central en móvil */}
          <div className="pt-2 sm:pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto px-2">
            {/* BOTÓN 1: CONTRATAR SERVICIO POR WHATSAPP */}
            <a
              href={wspLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black text-sm sm:text-base py-4 px-5 rounded-2xl shadow-xl transition-all active-scale flex items-center justify-center gap-3 border-2 border-emerald-400/60 group"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>CONTRATAR POR WSP</span>
            </a>

            {/* BOTÓN 2: YA ESTOY REGISTRADO / INGRESAR AL PORTAL */}
            <button
              type="button"
              onClick={() => onNavigateTab('dashboard')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-sm sm:text-base py-4 px-5 rounded-2xl shadow-xl transition-all active-scale flex items-center justify-center gap-3 border-2 border-amber-300 group"
            >
              <Shield className="w-5 h-5 fill-current" />
              <span>INGRESAR AL PORTAL</span>
            </button>
          </div>

          {/* INFO BÁSICA ADICIONAL PARA MÓVIL (LIMPIA) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left border-t border-slate-800/60 mt-4 px-2">
            <div className="space-y-1">
              <h4 className="text-amber-400 font-display font-bold text-xs uppercase tracking-wider">¿De qué trata?</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Simulador basado en el banco oficial de <strong className="text-slate-200">1,500 preguntas</strong> para el ascenso de Suboficiales PNP.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-amber-400 font-display font-bold text-xs uppercase tracking-wider">Contenido</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Incluye las <strong className="text-slate-200">22 Normas Oficiales</strong> (Materias Comunes y Especialidad) actualizadas al 2026.
              </p>
            </div>
          </div>

          {/* Botón secundario - Mas pequeño y discreto */}
          {onOpenExplainer && (
            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenExplainer}
                className="text-[10px] sm:text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
              >
                <span>¿Cómo funciona el Audio y WhatsApp?</span>
                <HelpCircle className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. DEMOSTRACIÓN DE PREGUNTA - Hidden on mobile to avoid confusion/clutter */}
      <div className="hidden sm:block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 text-slate-900 dark:text-slate-100 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/80 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30 inline-block mb-1">
              MUESTRA DEL BALOTARIO OFICIAL
            </span>
            <h2 className="font-display text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Prueba una pregunta real del examen
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <AudioButton
              textToRead={`Pregunta de muestra. Norma: ${sampleQuestion.norma}. ${sampleQuestion.enunciado}. Alternativas: ${sampleQuestion.opciones.map((op, i) => `Opción ${String.fromCharCode(65 + i)}: ${op}`).join('. ')}`}
              label="Escuchar audio"
              size="sm"
            />
            <button
              onClick={handleNextSample}
              className="bg-slate-100 dark:bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1 active-scale"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>Otra pregunta</span>
            </button>
          </div>
        </div>

        {/* CÓDIGO Y NORMA */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="bg-slate-100 dark:bg-slate-900 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
            CÓDIGO: {sampleQuestion.id}
          </span>
          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold uppercase">
            {sampleQuestion.norma}
          </span>
        </div>

        {/* ENUNCIADO */}
        <p className="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
          {sampleQuestion.enunciado}
        </p>

        {/* OPCIONES */}
        <div className="space-y-2 pt-1">
          {sampleQuestion.opciones.map((op, opIdx) => {
            const letra = String.fromCharCode(65 + opIdx);
            const isSelected = selectedOption === op;
            const isRight = op.trim() === sampleQuestion.respuesta.trim();

            let optionStyle =
              'bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';

            if (selectedOption !== null) {
              if (isRight) {
                optionStyle =
                  'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-500 font-bold ring-1 ring-emerald-500/50';
              } else if (isSelected) {
                optionStyle = 'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200 border-red-500 font-bold';
              }
            }

            return (
              <button
                key={opIdx}
                onClick={() => setSelectedOption(op)}
                className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-sans transition-all flex items-start gap-3 active-scale ${optionStyle}`}
              >
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold text-xs bg-amber-500/10 w-6 h-6 rounded flex items-center justify-center shrink-0 border border-amber-500/30">
                  {letra}
                </span>
                <span className="flex-1 leading-snug pt-0.5">{op}</span>
                {selectedOption !== null && isRight && (
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
                {selectedOption !== null && isSelected && !isRight && (
                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* FEEDBACK CORTO SI YA RESPONDIÓ */}
        {selectedOption !== null && (
          <div className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                    ¡CORRECTO! Base legal verificada.
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="text-red-700 dark:text-red-300 font-bold">
                    Respuesta oficial: {sampleQuestion.respuesta}
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => onNavigateTab('dashboard')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold px-3 py-1.5 rounded-lg text-xs shadow flex items-center gap-1 self-end sm:self-auto active-scale"
            >
              <span>Entrar al Portal a practicar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* PIE DE ACCESO RÁPIDO DISCRETO */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-mono">
        <span>RD N° 006857-2026-DIRREHUM-PNP/JE — Centro de Evaluación de Ascenso PNP 2026</span>
      </div>
    </div>
  );
};
