import React from 'react';
import {
  Shield,
  Play,
  UserPlus,
  LogIn,
  CheckCircle2,
  Award,
  ChevronRight,
  Sparkles,
  MessageCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { ActiveExamSession } from '../lib/activeExamStorage';
import { ActiveExamBanner } from './ActiveExamBanner';

interface LandingPageProps {
  onStartSimulacro: (modo: 'simulacro' | 'expres' | 'repaso' | 'norma') => void;
  onNavigateTab: (tab: string) => void;
  onOpenOtpModal?: () => void;
  onOpenExplainer?: () => void;
  activeExamSession?: ActiveExamSession | null;
  onResumeExam?: () => void;
  onDiscardExam?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartSimulacro,
  onNavigateTab,
  onOpenOtpModal,
  activeExamSession,
  onResumeExam,
  onDiscardExam,
}) => {
  const handleRegisterWhatsApp = () => {
    const message = encodeURIComponent('Hola, deseo inscribirme en el Simulador PNP 2026');
    window.open(`https://wa.me/51929172559?text=${message}`, '_blank');
  };

  const handleOpenHowItWorks = () => {
    document.dispatchEvent(new CustomEvent('open-how-it-works'));
  };

  return (
    <div className="min-h-[80vh] bg-[#F8FAFC] dark:bg-[#011611] text-slate-900 dark:text-slate-100 font-sans p-4 sm:p-6 pb-20 w-full overflow-x-hidden flex items-center justify-center transition-colors duration-300">
      <div className="max-w-7xl w-full mx-auto space-y-6 text-center">

        {/* LOGO Y TÍTULO DE LA PLATAFORMA */}
        <div className="flex flex-col items-center space-y-3 pt-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] bg-emerald-600 dark:bg-[#004d38] border-4 border-white dark:border-emerald-500/20 shadow-2xl flex items-center justify-center text-white transform -rotate-3 transition-transform hover:rotate-0">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>

          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl xs:text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight uppercase">
              Simulador PNP 2026
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-mono font-black shadow-sm uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Banco de 1,500 Preguntas Oficiales</span>
          </div>
        </div>

        {/* ACTIVE EXAM RESUME BANNER */}
        {activeExamSession && onResumeExam && onDiscardExam && (
          <div className="text-left">
            <ActiveExamBanner
              session={activeExamSession}
              onResume={onResumeExam}
              onDiscard={onDiscardExam}
            />
          </div>
        )}

        {/* TARJETAS ÚNICAS DE ACCIÓN: INGRESAR O REGISTRARSE */}
        <div className="grid grid-cols-1 gap-4 pt-1">
          {/* OPCIÓN 1: INGRESAR AL SIMULACRO */}
          <button
            type="button"
            onClick={() => onStartSimulacro('simulacro')}
            className="w-full bg-emerald-600 dark:bg-[#004d38] hover:bg-emerald-700 dark:hover:bg-[#005a42] text-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-4 sm:gap-5 border-2 border-emerald-500/30 active:scale-[0.98] text-left group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Shield className="w-24 h-24" />
            </div>
            
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-6 transition-transform">
              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-1" />
            </div>
            <div className="flex-1 min-w-0 z-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-black text-lg sm:text-2xl uppercase">INGRESAR A SIMULACRO</span>
                <span className="bg-emerald-950/40 text-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded-lg border border-emerald-400/30 font-black">
                  100 PREG.
                </span>
              </div>
              <p className="text-xs text-emerald-50/80 font-medium mt-1 leading-relaxed">
                Evaluación táctica de 180 min con sustento legal actualizado.
              </p>
            </div>
          </button>

          {/* OPCIÓN 2: REGISTRARSE SI ES NUEVO (MÁS VENDEDOR & ELEGANTE) */}
          <div className="w-full bg-white dark:bg-[#02281e] text-slate-900 dark:text-white rounded-3xl p-5 sm:p-6 shadow-lg border-2 border-slate-100 dark:border-emerald-800/30 text-center flex flex-col items-center gap-3.5 transition-all">
            <div className="flex flex-col items-center gap-1">
              <span className="font-display font-black text-base sm:text-xl text-slate-900 dark:text-white uppercase tracking-tight flex items-center justify-center gap-1.5">
                🚀 ¿AÚN NO TIENES CUENTA?
              </span>
              <p className="text-xs text-slate-500 dark:text-emerald-400/80 font-medium">
                Accede al balotario completo y a todos los simulacros oficiales.
              </p>
            </div>

            {/* BOTONES DE ACCIÓN: REGISTRO Y VER CÓMO FUNCIONA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full pt-1">
              <button
                type="button"
                onClick={handleRegisterWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm sm:text-base rounded-full shadow-md shadow-emerald-900/10 border border-emerald-400/40 transition-all hover:scale-105 active:scale-95 uppercase tracking-wide cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>¡Regístrate Ya!</span>
              </button>

              <button
                type="button"
                onClick={handleOpenHowItWorks}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-slate-100 dark:bg-emerald-950/60 hover:bg-slate-200 dark:hover:bg-emerald-900/80 border border-slate-200 dark:border-emerald-700/50 text-slate-800 dark:text-emerald-300 font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>¿Ver Cómo Funciona?</span>
              </button>
            </div>
          </div>
        </div>

        {/* BENEFICIOS RÁPIDOS (AJUSTADO EN TAMAÑO PARA GANAR ESPACIO) */}
        <div className="grid grid-cols-2 gap-2.5 text-left">
          <div className="bg-white dark:bg-[#02281e] border border-slate-100 dark:border-emerald-800/20 rounded-xl p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-[10px] sm:text-xs text-slate-600 dark:text-emerald-400 font-bold uppercase tracking-tight">22 Normas Legales</span>
          </div>
          <div className="bg-white dark:bg-[#02281e] border border-slate-100 dark:border-emerald-800/20 rounded-xl p-3 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-[10px] sm:text-xs text-slate-600 dark:text-emerald-400 font-bold uppercase tracking-tight">Sustento Oficial</span>
          </div>
        </div>

        {/* BANNER INFORMATIVO INFERIOR (COMPACTO) */}
        <div className="bg-white/50 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 rounded-2xl p-3.5 text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono font-black text-[11px] sm:text-xs uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" />
            <span>RD N° 006857-2026-DIRREHUM-PNP</span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-emerald-500/70 font-bold uppercase tracking-widest leading-relaxed">
            Preparación de Élite para Suboficiales y Oficiales PNP.
          </p>
        </div>

      </div>
    </div>
  );
};
