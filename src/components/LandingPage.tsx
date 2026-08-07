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
} from 'lucide-react';

interface LandingPageProps {
  onStartSimulacro: (modo: 'simulacro' | 'expres' | 'repaso' | 'norma') => void;
  onNavigateTab: (tab: string) => void;
  onOpenOtpModal?: () => void;
  onOpenExplainer?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartSimulacro,
  onNavigateTab,
  onOpenOtpModal,
}) => {
  const handleRegisterOrLogin = () => {
    if (onOpenOtpModal) {
      onOpenOtpModal();
    } else {
      onNavigateTab('dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#01241a] text-slate-100 font-sans p-4 sm:p-6 pb-20 w-full overflow-x-hidden flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto space-y-6 text-center">

        {/* LOGO Y TÍTULO DE LA PLATAFORMA */}
        <div className="flex flex-col items-center space-y-3 pt-2">
          <div className="w-20 h-20 rounded-3xl bg-[#004d38] border-2 border-emerald-500/40 shadow-2xl flex items-center justify-center text-white">
            <Shield className="w-10 h-10 text-emerald-300" />
          </div>

          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              Simulador PNP 2026
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium mt-1">
              Plataforma Oficial de Evaluación de Ascenso
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#004d38]/80 text-emerald-200 border border-emerald-600/50 px-3.5 py-1 rounded-full text-xs font-mono font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Balotario Oficial de 1,500 Preguntas</span>
          </div>
        </div>

        {/* TARJETAS ÚNICAS DE ACCIÓN: INGRESAR O REGISTRARSE */}
        <div className="space-y-4 pt-2">
          {/* OPCIÓN 1: INGRESAR AL SIMULACRO */}
          <button
            type="button"
            onClick={() => onStartSimulacro('simulacro')}
            className="w-full bg-[#004d38] hover:bg-[#005a42] text-white rounded-2xl p-5 sm:p-6 shadow-xl transition-all flex items-center gap-4 border-2 border-emerald-400/50 active:scale-[0.99] text-left group"
          >
            <div className="w-14 h-14 rounded-2xl bg-white text-[#01241a] flex items-center justify-center shrink-0 shadow-md font-black">
              <Play className="w-7 h-7 text-[#01241a] fill-current ml-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                <span>Ingresar al Simulacro</span>
                <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/40">
                  100 Preguntas
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 truncate mt-1">
                Evaluación real de 180 min con sustento legal
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-emerald-300 group-hover:text-white shrink-0 transition-transform group-hover:translate-x-1" />
          </button>

          {/* OPCIÓN 2: REGISTRARSE SI ES NUEVO */}
          <button
            type="button"
            onClick={handleRegisterOrLogin}
            className="w-full bg-white hover:bg-emerald-50 text-[#01241a] rounded-2xl p-5 sm:p-6 shadow-xl transition-all flex items-center gap-4 border-2 border-white active:scale-[0.99] text-left group"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#01241a] text-white flex items-center justify-center shrink-0 shadow-md">
              <UserPlus className="w-7 h-7 text-emerald-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-base sm:text-lg text-[#01241a] flex items-center gap-2">
                <span>Registrarse si eres Nuevo</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                  Acceso Rápido
                </span>
              </div>
              <p className="text-xs text-slate-600 truncate mt-1">
                Crea tu cuenta con tu teléfono o DNI para activar tu pase
              </p>
            </div>
            <LogIn className="w-6 h-6 text-[#01241a] group-hover:translate-x-1 shrink-0 transition-transform" />
          </button>
        </div>

        {/* BENEFICIOS RÁPIDOS */}
        <div className="grid grid-cols-2 gap-2 text-left pt-2">
          <div className="bg-[#003829] border border-emerald-700/50 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-emerald-200 font-medium">22 Normas Legales</span>
          </div>
          <div className="bg-[#003829] border border-emerald-700/50 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-emerald-200 font-medium">Sustento Legal Oficial</span>
          </div>
        </div>

        {/* BANNER INFORMATIVO INFERIOR */}
        <div className="bg-[#003829] border border-emerald-600/50 rounded-2xl p-4 text-center space-y-1.5 text-xs text-emerald-200">
          <div className="inline-flex items-center gap-1.5 text-emerald-200 font-mono font-bold text-[11px]">
            <Award className="w-4 h-4 text-emerald-300" />
            <span>RD N° 006857-2026-DIRREHUM-PNP</span>
          </div>
          <p className="text-[11px] text-emerald-300/80">
            Preparación especializada para Suboficiales y Oficiales PNP.
          </p>
        </div>

      </div>
    </div>
  );
};
