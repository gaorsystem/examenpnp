import React from 'react';
import { Shield, BookOpen, Clock, BarChart3, Search, Award, User, Sun, Moon, SlidersHorizontal, Home, LogIn, LogOut, Users, HelpCircle } from 'lucide-react';
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
    { id: 'simulacro', label: 'Simulacro Real', icon: Clock },
    { id: 'crear-simulacro', label: 'Armar Examen', icon: SlidersHorizontal },
    { id: 'normas', label: 'Por Materia', icon: Shield },
    { id: 'banco', label: 'Banco (1,500)', icon: Search },
  ];

  if (isLoggedIn && userProfile.role === 'admin') {
    portalTabs.push({ id: 'admin', label: 'Panel Admin', icon: Users });
  }

  const isLandingView = activeTab === 'landing';

  return (
    <header className="bg-[#011e17] text-white border-b border-[#053d2f] shadow-md sticky top-0 z-40">
      {/* Top Banner Status Bar */}
      <div className="bg-[#011611] px-4 py-1.5 border-b border-[#053d2f] flex justify-between items-center text-xs text-slate-300">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
          <span className="font-mono tracking-tight font-semibold text-emerald-300 truncate max-w-[120px] sm:max-w-none">
            OFICIAL 2026
          </span>
          <span className="hidden sm:inline text-emerald-800">|</span>
          <span className="hidden sm:inline text-emerald-200/80">
            Simulador de Ascenso PNP
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {userProfile.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-1.5 border px-2 py-1 rounded transition-all font-mono text-[10px] font-bold ${
                    activeTab === 'admin'
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  <span>ADMIN</span>
                </button>
              )}
              <button 
                onClick={onOpenProfile}
                className="hidden sm:flex items-center gap-1.5 bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-200 border border-emerald-600/40 px-2 py-1 rounded transition-all font-mono text-[10px]"
              >
                <User className="w-3 h-3 text-emerald-300" />
                <span className="font-bold">{userProfile.grado} {userProfile.nombre}</span>
              </button>
              <button
                onClick={onLogout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg transition-all active-scale flex items-center gap-1.5 font-mono text-[10px] font-bold"
                title="Cerrar Sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>SALIR</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {userProfile.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-1.5 border px-2 py-1 rounded transition-all font-mono text-[10px] font-bold ${
                    activeTab === 'admin'
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'text-emerald-400 hover:text-emerald-200 border-emerald-800'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  <span>ADMIN</span>
                </button>
              )}
              <button
                onClick={onOpenOtpModal}
                className="bg-white hover:bg-emerald-50 text-[#01241a] font-mono font-black text-[11px] px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md transition-all active-scale"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>INGRESAR</span>
              </button>
            </div>
          )}
          {onOpenGuideModal && (
            <button
              onClick={onOpenGuideModal}
              className="bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-600/40 px-2.5 py-1 rounded-lg transition-all active-scale flex items-center gap-1 font-mono text-[10px] font-extrabold"
              title="Ver Guía de Uso del Sistema"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span>GUÍA</span>
            </button>
          )}
          <div className="h-3 w-[1px] bg-emerald-800 mx-1"></div>
          <button
            onClick={onToggleTheme}
            className="text-emerald-300 hover:text-white transition-colors p-1"
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
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#059669] flex items-center justify-center shrink-0 shadow-lg border border-emerald-400/40">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-black text-lg sm:text-xl text-white tracking-tight leading-none">
              PNP <span className="text-emerald-300">2026</span>
            </h1>
            <p className="hidden sm:block text-[10px] text-emerald-200/80 font-sans mt-0.5">
              Simulador de Ascenso Oficial
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        {isLandingView ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenOtpModal}
              className="bg-white hover:bg-emerald-50 text-[#01241a] font-display font-black text-xs px-4 py-2 rounded-xl shadow-lg transition-all active-scale"
            >
              INGRESAR AL PORTAL
            </button>
          </div>
        ) : (
          /* Private Portal Student Navigation Tabs */
          <nav className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-mono text-emerald-200 hover:text-white hover:bg-[#004d38] transition-colors shrink-0"
              title="Volver a la portada informativa"
            >
              <Home className="w-3.5 h-3.5 text-emerald-300" />
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
                      ? 'bg-white text-[#01241a] font-bold shadow-md'
                      : 'text-emerald-200 hover:bg-[#004d38] hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#01241a]' : 'text-emerald-300'}`} />
                  {tab.label}
                </button>
              );
            })}

            <button
              onClick={onQuickSimulacro}
              className="ml-2 bg-[#059669] hover:bg-[#047857] text-white px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-md border border-emerald-400/50 shrink-0 transition-transform active-scale"
            >
              <Award className="w-3.5 h-3.5 text-emerald-200" />
              Examen Rápido
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
