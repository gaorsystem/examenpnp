import React from 'react';
import { Home, BarChart3, Clock, Shield, Search, Users } from 'lucide-react';
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
    { id: 'simulacro', label: 'Simulacro', icon: Clock, requiresAuth: true },
    { id: 'banco', label: '1,500 Preg.', icon: Search, requiresAuth: true },
    { id: 'normas', label: 'Por Materia', icon: Shield, requiresAuth: true },
  ];

  const privateNavItems = [
    { id: 'dashboard', label: 'Mi Portal', icon: BarChart3 },
    { id: 'simulacro', label: 'Simulacro', icon: Clock },
    { id: 'normas', label: 'Materia', icon: Shield },
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#011e17]/95 backdrop-blur-lg border-t border-[#053d2f] px-2 pt-2 pb-3 shadow-2xl transition-all"
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
              className={`flex flex-col items-center justify-center min-w-[62px] min-h-[50px] px-2 py-1 rounded-2xl transition-all active-scale cursor-pointer ${
                isActive
                  ? 'text-white font-bold scale-105'
                  : 'text-emerald-300/70 hover:text-white'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-500/30 text-white shadow-sm border border-emerald-400/40' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono tracking-tight mt-0.5 truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
