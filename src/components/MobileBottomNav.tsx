import React from 'react';
import { Home, BarChart3, Clock, Shield, Search, Users, Layers } from 'lucide-react';
import { UserProfile } from '../types';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  onOpenOtpModal: () => void;
  userProfile: UserProfile;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  isLoggedIn,
  onOpenOtpModal,
  userProfile,
}) => {
  const publicNavItems = [
    { id: 'landing', label: 'Inicio', icon: Home },
    { id: 'dashboard', label: 'Mi Portal', icon: BarChart3, requiresAuth: true },
    { id: 'simulacro', label: 'Simulacros', icon: Layers, requiresAuth: true },
    { id: 'banco', label: 'Banco Oficial', icon: Search, requiresAuth: true },
  ];

  const privateNavItems = [
    { id: 'dashboard', label: 'Mi Portal', icon: BarChart3 },
    { id: 'simulacro', label: 'Simulacros', icon: Layers },
    { id: 'banco', label: 'Balotario', icon: Search },
  ];

  if (isLoggedIn && userProfile.role === 'admin') {
    privateNavItems.push({ id: 'admin', label: 'Admin', icon: Users });
  }

  const navItems = isLoggedIn && activeTab !== 'landing' ? privateNavItems : publicNavItems;

  const handleNavClick = (item: typeof publicNavItems[0]) => {
    if (item.requiresAuth && !isLoggedIn) {
      onOpenOtpModal();
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <nav
      aria-label="Navegación móvil nativa"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#02281e]/95 backdrop-blur-xl border-t border-slate-100 dark:border-emerald-800/30 px-2 pt-2 pb-5 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] transition-all"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center min-w-[62px] gap-1 px-1 py-1 transition-all active-scale cursor-pointer ${
                isActive
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400 dark:text-emerald-500/50'
              }`}
            >
              <div
                className={`p-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-lg shadow-emerald-500/10' 
                    : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest font-mono truncate max-w-[64px] ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-slate-900 dark:bg-emerald-400 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
