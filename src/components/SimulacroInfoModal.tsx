import React from 'react';
import { Clock, Shield, HelpCircle, Zap, Play, X, Sparkles, BookOpen } from 'lucide-react';

export interface ExamModalDetails {
  mode: 'simulacro' | 'expres' | 'norma' | 'custom' | 'repaso';
  title: string;
  badge: string;
  badgeColor?: string;
  finalidad: string;
  comoFunciona: string[];
  preguntasCount: number;
  tiempoEstimado: string;
  permiteAyudas: boolean;
  retroalimentacion: 'instantanea' | 'al_final';
  normaNombre?: string;
  onConfirm: () => void;
}

interface SimulacroInfoModalProps {
  isOpen: boolean;
  details: ExamModalDetails | null;
  onClose: () => void;
}

export const SimulacroInfoModal: React.FC<SimulacroInfoModalProps> = ({
  isOpen,
  details,
  onClose,
}) => {
  if (!isOpen || !details) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#011e17] border-2 border-emerald-500/40 w-full max-w-lg rounded-3xl shadow-2xl text-slate-900 dark:text-white overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-50 dark:bg-[#011611] p-4 sm:p-5 border-b border-slate-200 dark:border-emerald-800/40 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className={`inline-block text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-sm ${details.badgeColor || 'bg-emerald-600 text-white'}`}>
                {details.badge}
              </span>
              <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white mt-1 leading-tight">
                {details.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 text-slate-700 dark:text-emerald-300 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans bg-white dark:bg-[#011e17]">
          
          {/* FINALIDAD */}
          <div className="bg-emerald-50 dark:bg-[#012d22] border border-emerald-200 dark:border-emerald-700/50 p-4 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-mono font-black text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>FINALIDAD Y OBJETIVO</span>
            </div>
            <p className="text-slate-700 dark:text-emerald-100 leading-relaxed font-medium text-xs sm:text-[13px]">
              {details.finalidad}
            </p>
          </div>

          {/* CÓMO FUNCIONA */}
          <div className="space-y-2">
            <h4 className="font-mono font-black text-[11px] text-slate-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ¿CÓMO FUNCIONA ESTA EVALUACIÓN?
            </h4>
            <div className="space-y-2">
              {details.comoFunciona.map((paso, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-[#01291f] border border-slate-200 dark:border-emerald-800/40 p-3 rounded-xl flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700 dark:text-slate-200 text-xs sm:text-[13px] leading-snug font-medium">
                    {paso}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PARÁMETROS CLAVE */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="bg-slate-50 dark:bg-[#01291f] border border-slate-200 dark:border-emerald-800/40 p-3 rounded-xl flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-emerald-300/80 uppercase block font-bold">PREGUNTAS</span>
                <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{details.preguntasCount} reactivos</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#01291f] border border-slate-200 dark:border-emerald-800/40 p-3 rounded-xl flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-emerald-300/80 uppercase block font-bold">TIEMPO LIMITADO</span>
                <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{details.tiempoEstimado}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#01291f] border border-slate-200 dark:border-emerald-800/40 p-3 rounded-xl flex items-center gap-2.5 col-span-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-emerald-300/80 uppercase block font-bold">MODO DE RESPUESTA</span>
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                  {details.retroalimentacion === 'instantanea'
                    ? 'Solución Inmediata + Base Legal al responder'
                    : 'Modo Examen Oficial (Solución y Claves al terminar)'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-[#011611] p-4 sm:p-5 border-t border-slate-200 dark:border-emerald-800/40 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-emerald-900/30 font-bold text-xs transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              details.onConfirm();
            }}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-display font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>ENTENDIDO, ¡INICIAR AHORA!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
