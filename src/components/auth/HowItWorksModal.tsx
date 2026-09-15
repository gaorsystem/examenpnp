import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Target, BarChart3, Smartphone, Zap, RotateCcw } from 'lucide-react';

export const HowItWorksModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    document.addEventListener('open-how-it-works', handleOpen);
    return () => {
      document.removeEventListener('open-how-it-works', handleOpen);
    };
  }, []);

  if (!isOpen) return null;

  const features = [
    {
      title: "Simulacros por Temario",
      description: "Practica con más de 1,500 preguntas organizadas según el Balotario Oficial 2026. Selecciona temas específicos para evaluar tu nivel táctico.",
      icon: <Target className="w-8 h-8 text-emerald-500" />,
      bgColor: "bg-emerald-50"
    },
    {
      title: "Simulacro Rapidín",
      description: "Ponte a prueba con 100 preguntas aleatorias contra el reloj (120 min) para simular la presión del examen real.",
      icon: <Zap className="w-8 h-8 text-indigo-500" />,
      bgColor: "bg-indigo-50"
    },
    {
      title: "Repaso Inteligente de Errores",
      description: "El sistema guarda automáticamente las preguntas en las que fallas para que las repases con su solución oficial y base legal.",
      icon: <RotateCcw className="w-8 h-8 text-amber-500" />,
      bgColor: "bg-amber-50"
    },
    {
      title: "Estadísticas de Precisión",
      description: "Monitorea tu progreso detallado. Identifica en qué áreas dominas y cuáles requieren más horas de estudio.",
      icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
      bgColor: "bg-blue-50"
    },
    {
      title: "Modo Offline PWA",
      description: "Instala la plataforma en tu celular y estudia en la calle, el micro o tu base sin consumir tus datos de internet.",
      icon: <Smartphone className="w-8 h-8 text-purple-500" />,
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-emerald-900 px-6 py-5 flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
            <h3 className="text-xl font-black text-white uppercase tracking-wider relative z-10 flex items-center gap-2">
              <Zap className="w-5 h-5 fill-emerald-400 text-emerald-400" />
              ¿Cómo Funciona?
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="relative z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-emerald-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-4">
            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-2">
              El Simulador PNP 2026 está diseñado específicamente para tu ascenso. Conoce las 5 herramientas principales que garantizan tu preparación:
            </p>

            {features.map((feature, idx) => (
              <div key={idx} className={`${feature.bgColor} border border-black/5 rounded-2xl p-4 flex gap-4 items-start`}>
                <div className="shrink-0 bg-white p-2.5 rounded-xl shadow-sm border border-black/5">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{feature.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 uppercase tracking-wider"
            >
              ¡Entendido, quiero probarlo!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
