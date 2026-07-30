import React from 'react';
import { Shield, BookOpen, Clock, BarChart3, Search, MessageSquare, Award, User, Sun, Moon, SlidersHorizontal, Home, LogIn, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  isLoggedIn: boolean;
  onOpenProfile: () => void;
  onOpenOtpModal: () => void;
  onLogout: () => void;
  onQuickSimulacro: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  isLoggedIn,
  onOpenProfile,
  onOpenOtpModal,
  onLogout,
  onQuickSimulacro,
  theme,
  onToggleTheme,
}) => {
  const portalTabs = [
    { id: 'dashboard', label: 'Panel Principal', icon: BarChart3 },
    { id: 'crear-simulacro', label: 'Armar Simulacro', icon: SlidersHorizontal },
    { id: 'simulacro', label: 'Simulacro Real', icon: Clock },
    { id: 'normas', label: 'Por Materia', icon: Shield },
    { id: 'banco', label: 'Banco (1,500)', icon: Search },
    { id: 'whatsapp', label: 'Bot WhatsApp', icon: MessageSquare },
  ];

  const isLandingView = activeTab === 'landing';

  return (
    <header className="bg-slate-900 dark:bg-slate-950 text-white border-b border-slate-800 dark:border-slate-800/80 shadow-md sticky top-0 z-40">
      {/* Top Banner Status Bar */}
      <div className="bg-slate-950 dark:bg-slate-900/90 px-4 py-1.5 border-b border-slate-800 flex flex-wrap justify-between items-center text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="font-mono tracking-wider font-semibold text-amber-400">
            RD N° 006857-2026-DIRREHUM-PNP/JE
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300">
            Concurso de Ascenso Suboficiales PNP · Promoción 2027
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Theme Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all active-scale"
            title={theme === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                <span>Modo Oscuro</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                <span>Modo Claro</span>
              </>
            )}
          </button>

          {isLoggedIn ? (
            <>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded font-mono text-[11px] font-semibold">
                {userProfile.grado} {userProfile.nombre}
              </span>
              <button
                onClick={onOpenProfile}
                className="hover:text-amber-400 flex items-center gap-1 font-mono transition-colors text-[11px] underline underline-offset-2 text-slate-300"
              >
                <User className="w-3 h-3 text-amber-400" />
                Perfil
              </button>
              <button
                onClick={onLogout}
                className="hover:text-red-400 flex items-center gap-1 font-mono transition-colors text-[11px] text-slate-400"
                title="Cerrar sesión y volver al inicio"
              >
                <LogOut className="w-3 h-3" />
                Salir
              </button>
            </>
          ) : (
            <button
              onClick={onOpenOtpModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold px-3 py-0.5 rounded text-[11px] flex items-center gap-1 shadow transition-all active-scale"
            >
              <LogIn className="w-3 h-3" />
              Ingresar con WhatsApp / OTP
            </button>
          )}
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 border border-amber-400/60 shadow-md flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="font-serif font-extrabold text-xl md:text-2xl text-white tracking-tight flex items-center gap-2">
              Simulador Ascenso PNP <span className="text-amber-400 text-xs font-mono font-bold border border-amber-400/40 px-1.5 py-0.5 rounded bg-amber-500/20">2026</span>
            </h1>
            <p className="text-xs text-slate-300 line-clamp-1 font-sans">
              1,500 Preguntas Oficiales · Plataforma Evaluativa de Alto Rendimiento
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        {isLandingView ? (
          /* Public Landing Navigation Bar */
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 text-amber-400 border border-amber-500/30"
            >
              <Home className="w-3.5 h-3.5" />
              Inicio / Convocatoria
            </button>
            <button
              onClick={onOpenOtpModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-extrabold text-xs px-4 py-2 rounded-xl shadow border border-amber-300 flex items-center gap-1.5 transition-all active-scale"
            >
              <LogIn className="w-3.5 h-3.5" />
              Portal del Postulante
            </button>
          </div>
        ) : (
          /* Private Portal Student Navigation Tabs */
          <nav className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              title="Volver a la portada informativa"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              Inicio
            </button>

            {portalTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap active-scale ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  {tab.label}
                </button>
              );
            })}

            <button
              onClick={onQuickSimulacro}
              className="ml-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-md border border-red-500/50 shrink-0 transition-transform active-scale"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              Examen Rápido
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};


