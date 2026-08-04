import React from 'react';
import { Clock, Shield, HelpCircle, CheckCircle, Zap, Play, X, Sparkles, BookOpen, AlertTriangle } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/50 w-full max-w-lg rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded ${details.badgeColor || 'bg-amber-500 text-slate-950'}`}>
                {details.badge}
              </span>
              <h2 className="font-display font-black text-lg sm:text-xl text-white mt-1">
                {details.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans text-slate-200">
          
          {/* FINALIDAD */}
          <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-mono font-black text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FINALIDAD Y OBJETIVO</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {details.finalidad}
            </p>
          </div>

          {/* CÓMO FUNCIONA */}
          <div className="space-y-2">
            <h4 className="font-mono font-black text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              ¿CÓMO FUNCIONA ESTA EVALUACIÓN?
            </h4>
            <div className="space-y-1.5">
              {details.comoFunciona.map((paso, idx) => (
                <div key={idx} className="bg-slate-800/60 border border-slate-700/60 p-2.5 rounded-xl flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200 text-xs leading-tight">
                    {paso}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PARÁMETROS CLAVE */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-slate-800/80 border border-slate-700 p-2.5 rounded-xl flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">PREGUNTAS</span>
                <span className="font-mono font-black text-sm text-white">{details.preguntasCount} reactivos</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-2.5 rounded-xl flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">TIEMPO LIMITADO</span>
                <span className="font-mono font-black text-sm text-white">{details.tiempoEstimado}</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-2.5 rounded-xl flex items-center gap-2.5 col-span-2">
              <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">MODO DE RESPUESTA</span>
                <span className="font-mono font-black text-xs text-white">
                  {details.retroalimentacion === 'instantanea'
                    ? 'Solución Inmediata + Base Legal al responder'
                    : 'Modo Examen Oficial (Solución y Claves al terminar)'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-mono text-xs font-bold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onClose();
              details.onConfirm();
            }}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg transition-all active-scale flex items-center gap-2 border border-amber-300"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>ENTENDIDO, ¡INICIAR AHORA!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
