import React, { useState } from 'react';
import {
  Shield,
  Play,
  MessageSquare,
  Smartphone,
  ArrowRight,
  RotateCcw,
  Zap,
  BookOpen,
  BrainCircuit,
  Search,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle,
  XCircle,
  Award,
  HelpCircle,
} from 'lucide-react';
import { BANCO_PREGUNTAS } from '../data/questionsData';

interface LandingPageProps {
  onStartSimulacro: (modo: 'simulacro' | 'expres' | 'repaso' | 'norma') => void;
  onNavigateTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartSimulacro,
  onNavigateTab,
}) => {
  // Estado para controlar qué tarjeta tiene los detalles desplegados
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Estado para controlar si el ejemplo de pregunta está desplegado
  const [showDemoQuestion, setShowDemoQuestion] = useState<boolean>(false);

  // Estado para la pregunta de prueba en vivo
  const [sampleQuestionIndex, setSampleQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const toggleDetail = (id: string) => {
    setExpandedCard(prev => (prev === id ? null : id));
  };

  const sampleQuestion = BANCO_PREGUNTAS[sampleQuestionIndex % BANCO_PREGUNTAS.length];

  const handleNextSample = () => {
    setSelectedOption(null);
    setSampleQuestionIndex(prev => (prev + 1) % BANCO_PREGUNTAS.length);
  };

  const isCorrect = selectedOption?.trim() === sampleQuestion.respuesta.trim();

  const wspLink =
    'https://wa.me/51987654321?text=Hola,%20deseo%20contratar%20el%20Servicio%20del%20Simulador%20de%20Ascenso%20PNP%202026%20(Balotario%201,500%20preguntas)%20y%20activar%20mi%20acceso.';

  // Módulos con botones directos y acordeón desplegable
  const actionModules = [
    {
      id: 'simulacro',
      icon: Shield,
      badge: '100 Preg. · 180 Min',
      color: 'amber',
      badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      iconBg: 'bg-amber-500/20 text-amber-500 border-amber-500/40',
      title: 'Simulacro Real Oficial 2026',
      actionText: 'Iniciar Examen Oficial',
      btnClass: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black',
      onAction: () => onStartSimulacro('simulacro'),
      details: [
        '100 preguntas distribuidas proporcionalmente en las 22 normas legales.',
        'Reloj continuo de 180 minutos con hoja de nota final de 0 a 100 puntos.',
        'Sustento legal de cada pregunta para revisar en cuáles fallaste y por qué.'
      ],
    },
    {
      id: 'whatsapp',
      icon: Smartphone,
      badge: 'Chat 24/7',
      color: 'emerald',
      badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40',
      title: 'Bot de WhatsApp Interactivo',
      actionText: 'Abrir Bot en WhatsApp',
      btnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white font-black',
      onAction: () => onNavigateTab('whatsapp'),
      details: [
        'Practica enviando solo las letras A, B, C o D desde tu celular.',
        'Sustentación con artículo legal al instante tras cada respuesta.',
        'Ideal para momentos libres o turnos de servicio sin instalar nada.'
      ],
    },
    {
      id: 'profesor_ia',
      icon: BrainCircuit,
      badge: 'Tutor IA Legal',
      color: 'sky',
      badgeClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
      iconBg: 'bg-sky-500/20 text-sky-500 border-sky-500/40',
      title: 'Profesor Legal con Inteligencia Artificial',
      actionText: 'Probar Tutor IA',
      btnClass: 'bg-sky-600 hover:bg-sky-500 text-white font-black',
      onAction: () => onStartSimulacro('expres'),
      details: [
        'Explicaciones e interpretación de casuística y artículos complejos.',
        'Resuelve preguntas engañosas y aclara dudas normativas al instante.',
        'Acceso directo durante las evaluaciones con el botón "Profesor IA".'
      ],
    },
    {
      id: 'repaso_srs',
      icon: RotateCcw,
      badge: 'Sistema SRS',
      color: 'purple',
      badgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      iconBg: 'bg-purple-500/20 text-purple-500 border-purple-500/40',
      title: 'Repaso Inteligente de Errores',
      actionText: 'Repasar Mis Errores',
      btnClass: 'bg-purple-600 hover:bg-purple-500 text-white font-black',
      onAction: () => onStartSimulacro('repaso'),
      details: [
        'Agrupa las preguntas en las que fallaste en simulacros anteriores.',
        'Repetición espaciada hasta que aciertes 2 veces consecutivas.',
        'Elimina errores para llegar con 100% de efectividad al examen.'
      ],
    },
    {
      id: 'expres',
      icon: Zap,
      badge: 'Test Exprés',
      color: 'amber',
      badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      iconBg: 'bg-amber-500/20 text-amber-500 border-amber-500/40',
      title: 'Evaluaciones Rápidas (10-20 Preg.)',
      actionText: 'Iniciar Test Exprés',
      btnClass: 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600 font-black',
      onAction: () => onStartSimulacro('expres'),
      details: [
        'Rondas ultrarrápidas de 10 o 20 preguntas para practicar en minutos.',
        'Respuesta e interpretación legal inmediata tras marcar cada opción.',
        'Incluye comodín 50/50 para descartar dos alternativas falsas.'
      ],
    },
    {
      id: 'normas',
      icon: BookOpen,
      badge: '22 Leyes',
      color: 'emerald',
      badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40',
      title: 'Estudio por Norma Legal Específica',
      actionText: 'Ver las 22 Leyes',
      btnClass: 'bg-emerald-700 hover:bg-emerald-600 text-white font-black',
      onAction: () => onNavigateTab('normas'),
      details: [
        'Selecciona una ley concreta (DL 1267, Ley 30714, Código Penal, etc.).',
        'Evaluaciones focalizadas para dominar norma por norma.',
        'Seguimiento visual de porcentaje de aciertos por ley.'
      ],
    },
    {
      id: 'banco',
      icon: Search,
      badge: '1,500 Preguntas',
      color: 'slate',
      badgeClass: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30',
      iconBg: 'bg-slate-500/20 text-slate-500 border-slate-500/40',
      title: 'Buscador y Colección Favoritos',
      actionText: 'Explorar Balotario',
      btnClass: 'bg-slate-800 hover:bg-slate-700 text-white font-black',
      onAction: () => onNavigateTab('banco'),
      details: [
        'Búsqueda en tiempo real por palabras clave ("flagrancia", "custodia").',
        'Opción para guardar preguntas difíciles en la lista de Favoritos.',
        'Verificación directa de claves oficiales y sustentos normativos.'
      ],
    },
    {
      id: 'custom',
      icon: Sliders,
      badge: 'Personalizado',
      color: 'purple',
      badgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      iconBg: 'bg-purple-500/20 text-purple-500 border-purple-500/40',
      title: 'Diseñador de Exámenes a Medida',
      actionText: 'Crear Examen a Medida',
      btnClass: 'bg-purple-700 hover:bg-purple-600 text-white font-black',
      onAction: () => onNavigateTab('custom'),
      details: [
        'Elige exactamente qué leyes combinar en tu examen.',
        'Ajusta la cantidad de preguntas y el tiempo límite a tu preferencia.',
        'Modo libre para entrenar sin presión de temporizador.'
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 pt-6 sm:pt-8 pb-12 w-full overflow-x-hidden">
      {/* 1. HERO COMPACTO Y VISUAL */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/50 rounded-2xl p-6 text-white shadow-xl text-center space-y-4 relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Badge Oficial */}
        <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 px-3 py-1 rounded-full text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BALOTARIO OFICIAL 2026 · RD N° 006857-2026</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-2xl sm:text-4xl font-black leading-tight text-white tracking-tight">
          Asegura tu <span className="text-amber-400">Ascenso PNP 2026</span>
        </h1>

        {/* Metricas rápidas visuales */}
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto text-center font-mono">
          <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-xl">
            <span className="text-sm sm:text-base font-black text-amber-400 block">1,500</span>
            <span className="text-[9px] text-slate-400">Preguntas</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-xl">
            <span className="text-sm sm:text-base font-black text-emerald-400 block">22</span>
            <span className="text-[9px] text-slate-400">Leyes</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-xl">
            <span className="text-sm sm:text-base font-black text-sky-400 block">24/7</span>
            <span className="text-[9px] text-slate-400">WhatsApp</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-xl">
            <span className="text-sm sm:text-base font-black text-purple-400 block">IA</span>
            <span className="text-[9px] text-slate-400">Tutor Legal</span>
          </div>
        </div>

        {/* Botones Principales */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 max-w-lg mx-auto">
          <a
            href={wspLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-emerald-400/50 active-scale"
          >
            <MessageSquare className="w-4 h-4 fill-current shrink-0" />
            <span>CONTRATAR POR WHATSAPP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => onNavigateTab('dashboard')}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-300 active-scale"
          >
            <Shield className="w-4 h-4 fill-current shrink-0" />
            <span>INGRESAR AL SIMULADOR</span>
          </button>
        </div>
      </div>

      {/* 2. ACCIONES DEL SIMULADOR (ACCIONES LIMPIAS CON DESPLEGABLE DE INFORMACIÓN) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
          <h2 className="font-display text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500 shrink-0" />
            <span>Descubre todo lo que esta plataforma hará por tu Ascenso:</span>
          </h2>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md shrink-0">
            Toca 🔻 para ver cómo funciona
          </span>
        </div>

        {/* Rejilla de Acciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actionModules.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedCard === item.id;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 text-slate-900 dark:text-slate-100 shadow-sm hover:border-amber-500/60 transition-all space-y-3"
              >
                {/* Cabecera corta */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${item.iconBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                </div>

                {/* Botón de Acción Directa */}
                <button
                  type="button"
                  onClick={item.onAction}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-mono flex items-center justify-center gap-2 shadow-sm transition-all active-scale ${item.btnClass}`}
                >
                  <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>{item.actionText}</span>
                </button>

                {/* Desplegable de explicación */}
                <button
                  type="button"
                  onClick={() => toggleDetail(item.id)}
                  className="w-full text-[10px] font-mono text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 flex items-center justify-center gap-1 transition-colors pt-0.5"
                >
                  <span>{isExpanded ? 'Ocultar detalles' : '🔻 Ver detalles y cómo funciona'}</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {/* Contenido desplegado */}
                {isExpanded && (
                  <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-sans space-y-1.5 animate-fadeIn">
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                      {item.details.map((d, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. EJEMPLO DE PREGUNTA EN VIVO (DESPLEGABLE / INTERACTIVO) */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 text-slate-900 dark:text-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Demostración Interactiva del Balotario
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowDemoQuestion(prev => !prev)}
            className="bg-slate-100 dark:bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 active-scale"
          >
            <span>{showDemoQuestion ? 'Ocultar Demo' : '🔻 Probar Pregunta Demo'}</span>
            {showDemoQuestion ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* PREGUNTA DEMO SI ESTÁ DESPLEGADA */}
        {showDemoQuestion && (
          <div className="bg-slate-50 dark:bg-slate-900/80 border border-amber-500/40 rounded-xl p-4 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                CÓDIGO: {sampleQuestion.id}
              </span>
              <button
                onClick={handleNextSample}
                className="text-slate-500 hover:text-amber-500 flex items-center gap-1 text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Cambiar pregunta</span>
              </button>
            </div>

            <p className="font-display text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
              {sampleQuestion.enunciado}
            </p>

            <div className="space-y-1.5">
              {sampleQuestion.opciones.map((op, opIdx) => {
                const letra = String.fromCharCode(65 + opIdx);
                const isSelected = selectedOption === op;
                const isRight = op.trim() === sampleQuestion.respuesta.trim();

                let optionStyle =
                  'bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';

                if (selectedOption !== null) {
                  if (isRight) {
                    optionStyle =
                      'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-500 font-bold';
                  } else if (isSelected) {
                    optionStyle = 'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200 border-red-500 font-bold';
                  }
                }

                return (
                  <button
                    key={opIdx}
                    onClick={() => setSelectedOption(op)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-start gap-2.5 ${optionStyle}`}
                  >
                    <span className="font-mono font-bold text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 w-5 h-5 rounded flex items-center justify-center shrink-0 border border-amber-500/30">
                      {letra}
                    </span>
                    <span className="flex-1 leading-snug pt-0.5">{op}</span>
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-500/40 text-xs font-mono flex items-center justify-between gap-2">
                <span className={isCorrect ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
                  {isCorrect ? '¡Correcto! Clave con sustento oficial.' : `Clave oficial: ${sampleQuestion.respuesta}`}
                </span>
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="bg-amber-500 text-slate-950 font-bold px-2.5 py-1 rounded text-[11px] shrink-0"
                >
                  Ir al Portal
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. BANNER FINAL CTA */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border border-emerald-500/60 rounded-2xl p-6 text-white text-center space-y-4 shadow-lg">
        <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto font-black">
          <Award className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="font-display font-black text-xl text-white">
            ¡Asegura tu Vacante de Ascenso PNP 2026!
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Activa tu acceso completo con el balotario oficial de 1,500 preguntas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-2 max-w-md mx-auto">
          <a
            href={wspLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>CONTRATAR POR WHATSAPP</span>
          </a>

          <button
            onClick={() => onNavigateTab('dashboard')}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2"
          >
            <span>INGRESAR AHORA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
