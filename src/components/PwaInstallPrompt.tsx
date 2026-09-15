import React, { useEffect, useState } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isAppMode = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;
    setIsStandalone(isAppMode);

    if (isAppMode) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Show iOS prompt after a short delay
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    // Android/Chrome - listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt || isStandalone) return null;

  if (isIOS) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-slideUp">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl flex flex-col gap-3 relative">
          <button 
            onClick={() => setShowPrompt(false)}
            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Instala la App Oficial</h3>
              <p className="text-slate-300 text-xs mt-1">Para una mejor experiencia a pantalla completa y acceso offline.</p>
            </div>
          </div>
          
          <div className="bg-slate-800 p-3 rounded-xl flex items-center gap-3 text-xs text-slate-300 mt-1">
            <span>Toca</span>
            <Share className="w-4 h-4 text-blue-400" />
            <span>y luego selecciona</span>
            <span className="font-bold text-white flex items-center gap-1">
               <PlusSquare className="w-3.5 h-3.5" /> Agregar a Inicio
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Android/Chrome Prompt
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[60] animate-slideUp">
      <div className="bg-emerald-900/95 backdrop-blur-xl border border-emerald-700/50 p-4 rounded-2xl shadow-2xl flex flex-col gap-4 relative">
        <button 
          onClick={() => setShowPrompt(false)}
          className="absolute top-2 right-2 p-1.5 text-emerald-400 hover:text-white rounded-full bg-emerald-800/50"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-xl shadow-lg flex items-center justify-center shrink-0">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div className="pr-4">
            <h3 className="text-white font-bold text-sm">App Simulacro PNP</h3>
            <p className="text-emerald-200 text-xs mt-0.5 leading-tight">Instala la app para estudiar sin internet y sin distracciones.</p>
          </div>
        </div>
        
        <button
          onClick={handleInstallClick}
          className="w-full bg-white text-emerald-900 font-bold py-2.5 rounded-xl text-sm shadow-md hover:bg-emerald-50 transition-colors active:scale-95"
        >
          Instalar App Ahora
        </button>
      </div>
    </div>
  );
};
