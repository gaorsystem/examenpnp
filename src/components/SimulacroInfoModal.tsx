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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#004d38] border-2 border-emerald-500/60 w-full max-w-lg rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#011e17] p-4 sm:p-5 border-b border-emerald-700/60 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded ${details.badgeColor || 'bg-emerald-600 text-white'}`}>
                {details.badge}
              </span>
              <h2 className="font-display font-black text-lg sm:text-xl text-white mt-1">
                {details.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans text-emerald-100">
          
          {/* FINALIDAD */}
          <div className="bg-[#003829] border border-emerald-700/60 p-3.5 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-300 font-mono font-black text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FINALIDAD Y OBJETIVO</span>
            </div>
            <p className="text-emerald-100/90 leading-relaxed">
              {details.finalidad}
            </p>
          </div>

          {/* CÓMO FUNCIONA */}
          <div className="space-y-2">
            <h4 className="font-mono font-black text-[11px] text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-300" />
              ¿CÓMO FUNCIONA ESTA EVALUACIÓN?
            </h4>
            <div className="space-y-1.5">
              {details.comoFunciona.map((paso, idx) => (
                <div key={idx} className="bg-[#003829] border border-emerald-700/60 p-2.5 rounded-xl flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-600/60">
                    {idx + 1}
                  </span>
                  <span className="text-emerald-100 text-xs leading-tight">
                    {paso}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PARÁMETROS CLAVE */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-[#003829] border border-emerald-700/60 p-2.5 rounded-xl flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-emerald-300 shrink-0" />
              <div>
                <span className="text-[10px] font-mono text-emerald-300/80 uppercase block font-bold">PREGUNTAS</span>
                <span className="font-mono font-black text-sm text-white">{details.preguntasCount} reactivos</span>
              </div>
            </div>

            <div className="bg-[#003829] border border-emerald-700/60 p-2.5 rounded-xl flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
              <div>
                <span className="text-[10px] font-mono text-emerald-300/80 uppercase block font-bold">TIEMPO LIMITADO</span>
                <span className="font-mono font-black text-sm text-white">{details.tiempoEstimado}</span>
              </div>
            </div>

            <div className="bg-[#003829] border border-emerald-700/60 p-2.5 rounded-xl flex items-center gap-2.5 col-span-2">
              <BookOpen className="w-4 h-4 text-emerald-300 shrink-0" />
              <div>
                <span className="text-[10px] font-mono text-emerald-300/80 uppercase block font-bold">MODO DE RESPUESTA</span>
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
        <div className="bg-[#011e17] p-4 border-t border-emerald-700/60 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-emerald-300 hover:text-white font-mono text-xs font-bold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onClose();
              details.onConfirm();
            }}
            className="bg-white hover:bg-emerald-50 text-[#01241a] font-mono font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg transition-all active-scale flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>ENTENDIDO, ¡INICIAR AHORA!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
