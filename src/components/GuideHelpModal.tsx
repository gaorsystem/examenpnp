import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  SlidersHorizontal,
  Clock,
  BookOpen,
  Search,
  MessageSquare,
  Sparkles,
  Volume2,
  CheckCircle2,
  Zap,
  Target,
  Shield,
  Award,
  Smartphone,
  ChevronRight,
  Info
} from 'lucide-react';

interface GuideHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const GuideHelpModal: React.FC<GuideHelpModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'todos',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialTab);

  if (!isOpen) return null;

  const guideSections = [
    {
      id: 'simulacros',
      title: 'Simulacros y Exámenes',
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      badge: 'Examen Oficial PNP',
      items: [
        {
          title: 'Simulacro Real (100 Preguntas)',
          desc: 'Simula el examen oficial con temporizador de cuenta regresiva (180 min) y hoja de respuestas final. Sin distracciones para medir tu puntaje real.',
          tag: '100 Preguntas / 180 Min'
        },
        {
          title: 'Armar Simulacro Personalizado',
          desc: 'Tú eliges cuántas preguntas responder (10, 20, 50 o 100), qué materias incluir (Ej: solo Ley PNP o CPT) y si deseas temporizador.',
          tag: 'A tu Medida'
        },
        {
          title: 'Examen Rápido Exprés',
          desc: 'Ideal para repasar en momentos libres (10 a 20 preguntas con retroalimentación instantánea en cada respuesta).',
          tag: 'Práctica Rápida'
        }
      ]
    },
    {
      id: 'materias',
      title: 'Estudio Por Materias',
      icon: BookOpen,
      color: 'from-emerald-500 to-emerald-600',
      badge: 'Temario 2026',
      items: [
        {
          title: 'Módulo por Norma Legal',
          desc: 'Selecciona una ley o código específico (Ej: DL 1267, Ley 30364, Código Penal, DDHH). Responderás solo preguntas sustentadas en esa norma.',
          tag: 'Enfoque Directo'
        },
        {
          title: 'Base Legal Transparente',
          desc: 'Al responder, el sistema te muestra el artículo y norma exacta que fundamenta la alternativa correcta para fijar el conocimiento.',
          tag: 'Sustento Legal'
        }
      ]
    },
    {
      id: 'banco',
      title: 'Banco de Preguntas',
      icon: Search,
      color: 'from-blue-500 to-blue-600',
      badge: '1,500+ Preguntas',
      items: [
        {
          title: 'Búsqueda Inteligente',
          desc: 'Escribe cualquier palabra clave (ej. "flagrancia", "arresto", "sanción grave") para encontrar todas las preguntas del banco vinculadas a ese tema.',
          tag: 'Búsqueda por Filtro'
        },
        {
          title: 'Práctica con Retroalimentación',
          desc: 'Practica directamente desde el banco con verificación instantánea de respuesta y audio de explicación.',
          tag: 'Estudio Libre'
        }
      ]
    },
    {
      id: 'comodines',
      title: 'Comodines y Herramientas IA',
      icon: Sparkles,
      color: 'from-purple-500 to-purple-600',
      badge: 'Ayudas en Vivo',
      items: [
        {
          title: '🤖 Profesor IA (Asistente Legal)',
          desc: 'Un tutor de inteligencia artificial te explica con manzanas la razón legal de la respuesta de manera sencilla y didáctica.',
          tag: 'Explicación IA'
        },
        {
          title: '🎧 Audio-Lectura con Voz de Mando',
          desc: 'Escucha el enunciado y alternativas narrados en audio claro para repasar con auriculares sin fatiga visual.',
          tag: 'Lectura por Voz'
        },
        {
          title: '❌ Comodín 50 / 50',
          desc: 'Elimina automáticamente dos alternativas incorrectas para ayudarte a razonar entre las dos opciones más cercanas.',
          tag: 'Descarte 50%'
        },
        {
          title: '⚡ Respuesta al Instante',
          desc: 'Aparece en verde si acertaste o en rojo si fallaste de inmediato, mostrando la base legal al segundo.',
          tag: 'Feedback Inmediato'
        }
      ]
    },
    {
      id: 'whatsapp',
      title: 'Bot de WhatsApp 24/7',
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-600',
      badge: 'En tu Celular',
      items: [
        {
          title: 'Práctica por Mensaje de Texto',
          desc: 'El bot te envía preguntas del temario directo a WhatsApp. Respondes enviando la letra A, B, C, D o E.',
          tag: 'Sin Instalar Apps'
        },
        {
          title: 'Reportes de Avance',
          desc: 'Solicita tu nota, racha y resumen de fallos escribiendo comandos al bot en cualquier momento del día.',
          tag: 'Disponible 24 Horas'
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/40 w-full max-w-4xl rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl text-white flex items-center gap-2">
                Guía Rápida del Postulante PNP <span className="text-amber-400 text-xs px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40">2026</span>
              </h2>
              <p className="text-xs text-slate-300 font-sans">
                Aprende qué hace cada sección y cómo aprovechar las herramientas de estudio.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Cerrar Guía"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categorías Navigation Bar */}
        <div className="bg-slate-950/70 px-4 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveCategory('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === 'todos'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Ver Todo
          </button>
          {guideSections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeCategory === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveCategory(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {sec.title}
              </button>
            );
          })}
        </div>

        {/* Body Content with Scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {guideSections
            .filter((sec) => activeCategory === 'todos' || activeCategory === sec.id)
            .map((sec) => {
              const Icon = sec.icon;
              return (
                <div key={sec.id} className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-r ${sec.color} flex items-center justify-center text-slate-950 font-bold shadow-md`}>
                        <Icon className="w-4 h-4 text-slate-950" />
                      </div>
                      <h3 className="font-display font-black text-base text-white">
                        {sec.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {sec.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sec.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/80 border border-slate-700/50 hover:border-amber-500/40 p-3.5 rounded-xl space-y-1.5 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-amber-300 flex items-center gap-1.5">
                            <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            {item.title}
                          </h4>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold shrink-0">
                            {item.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed pl-5">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

          {/* Banner de Pro Tip */}
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-amber-300 uppercase tracking-wider font-mono">
                CONSEJO PARA EL DÍA DEL EXAMEN OFICIAL
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Practica constantemente en modo <strong className="text-white">Simulacro Real</strong> para acostumbrarte a la presión del tiempo (180 minutos) y usa el <strong className="text-white font-bold">Bot de WhatsApp</strong> para repasar 5 minutos al día en tus ratos libres.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-black text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all active-scale flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ENTENDIDO, ¡EMPEZAR A ESTUDIAR!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
