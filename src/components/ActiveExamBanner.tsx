import React, { useState } from 'react';
import { Play, Pause, Clock, CheckCircle2, Trash2, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import { ActiveExamSession } from '../lib/activeExamStorage';

interface ActiveExamBannerProps {
  session: ActiveExamSession;
  onResume: () => void;
  onDiscard: () => void;
  className?: string;
}

export const ActiveExamBanner: React.FC<ActiveExamBannerProps> = ({
  session,
  onResume,
  onDiscard,
  className = '',
}) => {
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);

  const total = session.preguntas.length;
  const respondidas = Object.keys(session.respuestasMap || {}).length;
  const porcentaje = total > 0 ? Math.round((respondidas / total) * 100) : 0;

  const mins = Math.floor(session.segundosRestantes / 60);
  const secs = session.segundosRestantes % 60;
  const tiempoFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div
      className={`relative bg-gradient-to-r from-[#01221a] via-[#012f24] to-[#011a14] border-2 border-emerald-500/50 rounded-2xl p-4 sm:p-5 shadow-xl shadow-emerald-950/40 text-white overflow-hidden transition-all ${className}`}
    >
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {session.status === 'paused' ? 'Examen Pausado' : 'Examen en Curso'}
            </span>

            <span className="bg-slate-800/80 text-slate-300 border border-slate-700/60 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
              Pregunta {session.currentIndex + 1} de {total}
            </span>

            {session.segundosRestantes > 0 && (
              <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
                <Clock className="w-3 h-3" />
                {tiempoFormatted} restante
              </span>
            )}
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate leading-snug">
              {session.tituloExamen || 'Simulacro de Ascenso PNP'}
            </h3>
            <p className="text-xs text-emerald-300/80">
              Progreso guardado automáticamente: {respondidas} de {total} preguntas respondidas ({porcentaje}% completado)
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-900/80 rounded-full h-2 overflow-hidden border border-emerald-900/40 max-w-md">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${porcentaje}%` }}
            ></div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 pt-2 md:pt-0">
          {!showConfirmDiscard ? (
            <>
              <button
                type="button"
                onClick={() => setShowConfirmDiscard(true)}
                className="px-3 py-2.5 rounded-xl border border-red-500/30 bg-red-950/30 text-red-300 hover:bg-red-900/40 text-xs font-bold transition-all flex items-center gap-1.5"
                title="Descartar este examen y empezar uno nuevo"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Descartar</span>
              </button>

              <button
                type="button"
                onClick={onResume}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/50 flex items-center gap-2 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Continuar Examen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 p-2 bg-red-950/60 border border-red-500/50 rounded-xl">
              <span className="text-[11px] text-red-200 font-medium">¿Seguro de borrar?</span>
              <button
                type="button"
                onClick={onDiscard}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold"
              >
                Sí, borrar
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDiscard(false)}
                className="px-2 py-1 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-[11px]"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
