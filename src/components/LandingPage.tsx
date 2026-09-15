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

  return (
    <div className="min-h-[80vh] bg-[#F8FAFC] dark:bg-[#011611] text-slate-900 dark:text-slate-100 font-sans p-4 sm:p-6 pb-20 w-full overflow-x-hidden flex items-center justify-center transition-colors duration-300">
      <div className="max-w-7xl w-full mx-auto space-y-8 text-center">

        {/* LOGO Y TÍTULO DE LA PLATAFORMA */}
        <div className="flex flex-col items-center space-y-4 pt-2">
          <div className="w-24 h-24 rounded-[32px] bg-emerald-600 dark:bg-[#004d38] border-4 border-white dark:border-emerald-500/20 shadow-2xl flex items-center justify-center text-white transform -rotate-3 transition-transform hover:rotate-0">
            <Shield className="w-12 h-12 text-white" />
          </div>

          <div className="space-y-1">
            <h1 className="font-display font-black text-3xl xs:text-4xl sm:text-5xl text-slate-900 dark:text-white tracking-tight uppercase">
              Simulador PNP 2026
            </h1>

          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 px-4 py-1.5 rounded-full text-xs font-mono font-black shadow-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
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
        <div className="grid grid-cols-1 gap-4 pt-2">
          {/* OPCIÓN 1: INGRESAR AL SIMULACRO */}
          <button
            type="button"
            onClick={() => onStartSimulacro('simulacro')}
            className="w-full bg-emerald-600 dark:bg-[#004d38] hover:bg-emerald-700 dark:hover:bg-[#005a42] text-white rounded-3xl p-6 shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-5 border-2 border-emerald-500/30 active:scale-[0.98] text-left group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Shield className="w-24 h-24" />
            </div>
            
            <div className="w-14 h-14 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-6 transition-transform">
              <Play className="w-7 h-7 fill-current ml-1" />
            </div>
            <div className="flex-1 min-w-0 z-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-black text-xl sm:text-2xl uppercase">INGRESAR A SIMULACRO</span>
                <span className="bg-emerald-950/40 text-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded-lg border border-emerald-400/30 font-black">
                  100 PREG.
                </span>
              </div>
              <p className="text-xs text-emerald-50/80 font-medium mt-1 leading-relaxed">
                Evaluación táctica de 180 min con sustento legal actualizado.
              </p>
            </div>
          </button>

          {/* OPCIÓN 2: REGISTRARSE SI ES NUEVO */}
          <button
            type="button"
            onClick={handleRegisterWhatsApp}
            className="w-full bg-white dark:bg-[#02281e] hover:bg-slate-50 dark:hover:bg-emerald-900/20 text-slate-900 dark:text-white rounded-3xl p-6 shadow-lg border-2 border-slate-100 dark:border-emerald-800/30 active:scale-[0.98] text-left group transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-lg group-hover:-rotate-6 transition-transform">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white uppercase">Inscripciones 2026</span>
                <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/50 font-black">
                  WHATSAPP
                </span>
              </div>

            </div>
          </button>
        </div>

        {/* BENEFICIOS RÁPIDOS */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="bg-white dark:bg-[#02281e] border border-slate-100 dark:border-emerald-800/20 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-[11px] sm:text-xs text-slate-600 dark:text-emerald-400 font-bold uppercase tracking-tight">22 Normas Legales</span>
          </div>
          <div className="bg-white dark:bg-[#02281e] border border-slate-100 dark:border-emerald-800/20 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-[11px] sm:text-xs text-slate-600 dark:text-emerald-400 font-bold uppercase tracking-tight">Sustento Oficial</span>
          </div>
        </div>

        {/* BANNER INFORMATIVO INFERIOR */}
        <div className="bg-white/50 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/30 rounded-3xl p-5 text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono font-black text-xs uppercase tracking-widest">
            <Award className="w-4 h-4" />
            <span>RD N° 006857-2026-DIRREHUM-PNP</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-emerald-500/70 font-bold uppercase tracking-widest leading-relaxed">
            Preparación de Élite para Suboficiales y Oficiales PNP.
          </p>
        </div>

      </div>
    </div>
  );
};
