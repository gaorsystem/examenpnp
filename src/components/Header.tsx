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
      {/* Top Banner Status Bar - Simplified for mobile */}
      <div className="bg-slate-950 dark:bg-slate-900/90 px-4 py-1.5 border-b border-slate-800 flex justify-between items-center text-xs text-slate-300">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
          <span className="font-mono tracking-tight font-semibold text-amber-400 truncate max-w-[120px] sm:max-w-none">
            OFICIAL 2026
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">
            Simulador de Ascenso PNP
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono text-[10px]">
                {userProfile.grado} {userProfile.nombre}
              </span>
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-red-400 transition-colors p-1"
                title="Salir"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenOtpModal}
              className="text-amber-400 font-mono font-bold text-[10px] sm:text-xs flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <LogIn className="w-3 h-3" />
              <span>INGRESAR</span>
            </button>
          )}
          <div className="h-3 w-[1px] bg-slate-800 mx-1"></div>
          <button
            onClick={onToggleTheme}
            className="text-slate-400 hover:text-amber-400 transition-colors p-1"
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Header Row - Compact */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div 
          className="flex items-center gap-2.5 cursor-pointer shrink-0" 
          onClick={() => setActiveTab('landing')}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500 flex items-center justify-center shrink-0 shadow-lg">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="font-display font-black text-lg sm:text-xl text-white tracking-tight leading-none">
              PNP <span className="text-amber-400">2026</span>
            </h1>
            <p className="hidden sm:block text-[10px] text-slate-400 font-sans mt-0.5">
              Simulador de Ascenso Oficial
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        {isLandingView ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenOtpModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xs px-4 py-2 rounded-xl shadow-lg transition-all active-scale"
            >
              INGRESAR AL PORTAL
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
                  type="button"
                  onClick={() => {
                    if (!isLoggedIn) {
                      onOpenOtpModal();
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
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


