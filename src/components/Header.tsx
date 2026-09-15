import React from 'react';
import { Shield, BookOpen, Clock, BarChart3, Search, Award, User, Sun, Moon, SlidersHorizontal, Home, LogIn, LogOut, Users, HelpCircle, Layers } from 'lucide-react';
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
  onOpenGuideModal?: () => void;
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
  onOpenGuideModal,
  theme,
  onToggleTheme,
}) => {
  const portalTabs = [
    { id: 'dashboard', label: 'Panel Principal', icon: BarChart3 },
    { id: 'simulacro', label: 'Simulacros por Tema', icon: Layers },
    { id: 'banco', label: 'Banco Oficial', icon: Search },
  ];

  if (isLoggedIn && userProfile.role === 'admin') {
    portalTabs.push({ id: 'admin', label: 'Panel Admin', icon: Users });
  }

  const isLandingView = activeTab === 'landing';

  return (
    <header className="bg-white dark:bg-[#02281e] text-slate-900 dark:text-white border-b border-slate-100 dark:border-emerald-800/20 shadow-sm sticky top-0 z-40 backdrop-blur-md">
      {/* Top Banner Status Bar */}
      <div className="bg-slate-900 dark:bg-black/40 px-3 sm:px-4 py-1.5 border-b border-white/5 dark:border-emerald-800/10 flex justify-between items-center text-[9px] sm:text-[10px] font-mono tracking-widest font-black uppercase">
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-500">SISTEMA ACTIVO</span>
          </div>
          <span className="text-slate-500 hidden xs:inline">|</span>
          <span className="text-slate-400 hidden xs:inline">ASCENSO PNP 2026</span>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            onClick={onToggleTheme}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                <span className="hidden xxs:inline">MODO OSCURO</span>
              </>
            ) : (
              <>
                <Sun className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                <span className="hidden xxs:inline">MODO CLARO</span>
              </>
            )}
          </button>
          {isLoggedIn && (
            <button
              onClick={onLogout}
              className="text-rose-500 hover:text-rose-400 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3 h-3" />
              <span>SALIR</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-4">
        <div 
          className="flex items-center gap-3 cursor-pointer shrink-0 group" 
          onClick={() => setActiveTab('landing')}
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-emerald-600 flex items-center justify-center shrink-0 shadow-lg group-active:scale-95 transition-all">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-black text-xl text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
              SIMULADOR <span className="text-emerald-600 dark:text-emerald-400">PNP</span>
            </h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">
              Promoción 2027
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        {!isLandingView && (
          <nav className="hidden md:flex items-center gap-1">
            {portalTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active-scale ${
                    isActive
                      ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-emerald-900/20'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <button 
              onClick={onOpenProfile}
              className="flex items-center gap-2 bg-slate-50 dark:bg-emerald-900/20 hover:bg-slate-100 dark:hover:bg-emerald-900/40 text-slate-900 dark:text-white border border-slate-200 dark:border-emerald-800/30 px-3 py-2 rounded-xl transition-all active-scale shadow-sm"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-emerald-800 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-slate-500 dark:text-emerald-300" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight hidden sm:block">
                {userProfile.grado} {userProfile.nombre.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenOtpModal}
              className="bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-display font-black text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-lg transition-all active-scale"
            >
              INGRESAR
            </button>
          )}
          
          {onOpenGuideModal && (
            <button
              onClick={onOpenGuideModal}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-all active-scale border border-emerald-100 dark:border-emerald-800/30"
              title="Guía de Usuario"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
