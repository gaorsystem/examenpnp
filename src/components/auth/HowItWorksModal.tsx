import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Target,
  BarChart3,
  Smartphone,
  Zap,
  RotateCcw,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  WifiOff,
  Flame,
  FileText,
} from 'lucide-react';

export const HowItWorksModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    document.addEventListener('open-how-it-works', handleOpen);
    return () => {
      document.removeEventListener('open-how-it-works', handleOpen);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-[#01281e] border border-slate-200 dark:border-emerald-700/50 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-emerald-950 dark:bg-[#003828] border-b border-emerald-800/40 px-5 py-4 flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                  ¿Cómo Funciona?
                </h3>
                <p className="text-xs text-emerald-300 font-medium">
                  5 potentes herramientas para asegurar tu ascenso PNP
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="relative z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-emerald-200 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Visual Cards Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4">

            {/* 1. BALOTARIO OFICIAL */}
            <div className="bg-slate-50 dark:bg-[#021f18] border border-slate-200/80 dark:border-emerald-800/40 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-mono font-black text-xs flex items-center justify-center">1</span>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">1,500 Preguntas con Sustento Legal</h4>
                </div>
                <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full font-mono">
                  22 Normas
                </span>
              </div>
              
              {/* Mini Visual Preview */}
              <div className="bg-white dark:bg-[#002f23] rounded-xl p-3 border border-slate-200 dark:border-emerald-700/30 text-left space-y-2 mt-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  <FileText className="w-3.5 h-3.5" /> DL N° 1267 • ART. 10
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                  ¿Cuál es la función primordial de la Policía Nacional del Perú?
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-lg border border-emerald-300/40 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Respuesta correcta justificada con la ley oficial.</span>
                </div>
              </div>
            </div>

            {/* 2. SIMULACRO REAL CON TEMPORIZADOR */}
            <div className="bg-slate-50 dark:bg-[#021f18] border border-slate-200/80 dark:border-emerald-800/40 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono font-black text-xs flex items-center justify-center">2</span>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Simulacro Tipo Examen con Tiempo</h4>
                </div>
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full font-mono">
                  100 Preguntas
                </span>
              </div>

              {/* Mini Visual Preview */}
              <div className="grid grid-cols-2 gap-2 mt-2 text-center">
                <div className="bg-white dark:bg-[#002f23] p-3 rounded-xl border border-slate-200 dark:border-emerald-700/30 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-amber-500 font-mono font-black text-lg">
                    <Clock className="w-4 h-4 animate-pulse" /> 120:00
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-emerald-400 font-bold uppercase tracking-wider mt-0.5">Reloj en Vivo</span>
                </div>
                <div className="bg-white dark:bg-[#002f23] p-3 rounded-xl border border-slate-200 dark:border-emerald-700/30 flex flex-col items-center justify-center">
                  <div className="text-emerald-600 dark:text-emerald-400 font-mono font-black text-lg">
                    94.50 <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-emerald-400 font-bold uppercase tracking-wider mt-0.5">Nota Instantánea</span>
                </div>
              </div>
            </div>

            {/* 3. REPASO INTELIGENTE DE ERRORES */}
            <div className="bg-slate-50 dark:bg-[#021f18] border border-slate-200/80 dark:border-emerald-800/40 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-mono font-black text-xs flex items-center justify-center">3</span>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Repaso Inteligente de Errores (SRS)</h4>
                </div>
                <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full font-mono">
                  Memoria Activa
                </span>
              </div>

              {/* Mini Visual Preview */}
              <div className="bg-white dark:bg-[#002f23] rounded-xl p-3 border border-slate-200 dark:border-emerald-700/30 flex items-center justify-between gap-3 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800 dark:text-white">Banco de Preguntas Falladas</div>
                    <div className="text-[11px] text-slate-500 dark:text-emerald-400/80">Te vuelve a preguntar sólo las que fallaste hasta dominarlas.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. GRÁFICOS DE DOMINIO POR MATERIA */}
            <div className="bg-slate-50 dark:bg-[#021f18] border border-slate-200/80 dark:border-emerald-800/40 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-mono font-black text-xs flex items-center justify-center">4</span>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Estadísticas y Dominio Táctico</h4>
                </div>
                <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full font-mono">
                  Progreso
                </span>
              </div>

              {/* Mini Visual Progress Bars */}
              <div className="bg-white dark:bg-[#002f23] rounded-xl p-3 border border-slate-200 dark:border-emerald-700/30 space-y-2 mt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-emerald-200">
                    <span>Constitución y DDHH</span>
                    <span className="text-emerald-600 dark:text-emerald-400">92%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-emerald-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[92%]"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-emerald-200">
                    <span>Régimen Disciplinario PNP (Ley 30714)</span>
                    <span className="text-blue-600 dark:text-blue-400">86%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-emerald-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full w-[86%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. PRÁCTICA FOCALIZADA POR NORMA */}
            <div className="bg-slate-50 dark:bg-[#021f18] border border-slate-200/80 dark:border-emerald-800/40 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-mono font-black text-xs flex items-center justify-center">5</span>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Simulacros a Medida por Norma</h4>
                </div>
                <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full font-mono">
                  Personalizado
                </span>
              </div>

              {/* Mini Visual Preview */}
              <div className="bg-white dark:bg-[#002f23] rounded-xl p-3 border border-slate-200 dark:border-emerald-700/30 space-y-2 mt-2">
                <div className="text-[11px] text-slate-600 dark:text-emerald-300 font-medium">
                  Elige qué leyes específicas entrenar para reforzar tus puntos débiles:
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
                  <div className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-lg border border-emerald-300/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ley N° 30714
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-lg border border-emerald-300/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> DL N° 1267 PNP
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-lg border border-emerald-300/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> DL N° 1186 Fuerza
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-lg border border-emerald-300/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Código Penal
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          {/* Footer CTA */}
          <div className="p-4 border-t border-slate-200 dark:border-emerald-800/50 bg-slate-50 dark:bg-[#00281e] shrink-0 flex gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl text-sm transition-all shadow-md active:scale-95 uppercase tracking-wider cursor-pointer"
            >
              ¡Entendido, quiero empezar!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
