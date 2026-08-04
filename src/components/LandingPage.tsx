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
  Target,
  Check,
  Star,
  Users,
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
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [sampleIndex, setSampleIndex] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);

  const toggleDetail = (id: string) => {
    setExpandedCard(prev => (prev === id ? null : id));
  };

  const sampleQuestion = BANCO_PREGUNTAS[sampleIndex % BANCO_PREGUNTAS.length];

  const wspLink =
    'https://wa.me/51987654321?text=Hola,%20deseo%20contratar%20el%20Servicio%20del%20Simulador%20de%20Ascenso%20PNP%202026%20(Balotario%201,500%20preguntas)%20y%20activar%20mi%20acceso.';

  // Módulos concisos, ultra-visuales con íconos e indicadores de impacto
  const visualModules = [
    {
      id: 'simulacro_100',
      title: 'Simulacro Real 100 Preg.',
      tag: '100 PREG · 180 MIN',
      tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      icon: Shield,
      iconColor: 'bg-amber-500 text-slate-950',
      benefit: 'Mide tu puntaje exacto de 0 a 100 con la misma distribución y tiempo del examen oficial.',
      actionText: 'Iniciar Simulacro Oficial',
      btnStyle: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black',
      onAction: () => onStartSimulacro('simulacro'),
      bullets: [
        '100 preguntas de las 22 normas legales del temario.',
        'Cronómetro de 180 minutos con hoja de respuestas al instante.',
        'Sustento jurídico artículo por artículo.'
      ]
    },
    {
      id: 'bot_wsp',
      title: 'Bot WhatsApp 24/7',
      tag: 'SIN INSTALAR APPS',
      tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      icon: Smartphone,
      iconColor: 'bg-emerald-500 text-slate-950',
      benefit: 'Practica en tu celular respondiendo mensajes en tus tiempos libres o de servicio.',
      actionText: 'Probar Bot WhatsApp',
      btnStyle: 'bg-emerald-600 hover:bg-emerald-500 text-white font-black',
      onAction: () => onNavigateTab('whatsapp'),
      bullets: [
        'Responde A, B, C o D en el chat.',
        'Recibe la confirmación y el artículo de ley al instante.',
        'Guarda tu avance y racha diaria.'
      ]
    },
    {
      id: 'tutor_ia',
      title: 'Profesor Legal IA',
      tag: 'BASE LEGAL INTERACTIVA',
      tagColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
      icon: BrainCircuit,
      iconColor: 'bg-sky-500 text-slate-950',
      benefit: 'Resuelve tus dudas en preguntas dudosas con la explicación del artículo legal en vivo.',
      actionText: 'Ver Profesor IA',
      btnStyle: 'bg-sky-600 hover:bg-sky-500 text-white font-black',
      onAction: () => onStartSimulacro('expres'),
      bullets: [
        'Explicación en lenguaje sencillo de artículos complejos.',
        'Analiza casuísticas del Código Penal y Ley PNP.',
        'Despeja alternativas parecidas al instante.'
      ]
    },
    {
      id: 'repaso_srs',
      title: 'Repaso de Errores',
      tag: 'ALGORITMO MEMORIA',
      tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      icon: RotateCcw,
      iconColor: 'bg-purple-500 text-slate-950',
      benefit: 'Elimina tus fallos volviendo a practicar únicamente las preguntas en las que te equivocaste.',
      actionText: 'Repasar Mis Errores',
      btnStyle: 'bg-purple-600 hover:bg-purple-500 text-white font-black',
      onAction: () => onStartSimulacro('repaso'),
      bullets: [
        'Guarda automáticamente cada pregunta fallada.',
        'Repetición espaciada hasta lograr 100% de acierto.',
        'Asegura la retención de plazos y números de ley.'
      ]
    },
    {
      id: 'test_expres',
      title: 'Test Exprés (10-20 Preg.)',
      tag: '10 MINUTOS',
      tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      icon: Zap,
      iconColor: 'bg-amber-400 text-slate-950',
      benefit: 'Entrenamientos ultrarrápidos con comodín 50/50 y solución inmediata tras cada clic.',
      actionText: 'Test Exprés Inmediato',
      btnStyle: 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 font-black',
      onAction: () => onStartSimulacro('expres'),
      bullets: [
        'Ideal para sesiones breves de 10 minutos.',
        'Incluye comodín 50/50 para eliminar 2 falsas.',
        'Gana velocidad de lectura y descarte.'
      ]
    },
    {
      id: 'normas',
      title: 'Estudio por Norma Legal',
      tag: '22 LEYES OFICIALES',
      tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      icon: BookOpen,
      iconColor: 'bg-emerald-400 text-slate-950',
      benefit: 'Refuerza individualmente la ley en la que sientas mayor duda (Ley PNP, Disciplina, etc.).',
      actionText: 'Ver las 22 Normas',
      btnStyle: 'bg-emerald-700 hover:bg-emerald-600 text-white font-black',
      onAction: () => onNavigateTab('normas'),
      bullets: [
        'Practica ley por ley de forma enfocada.',
        'Mide tu % de acierto por cada cuerpo normativo.',
        'Consolida los temas de mayor peso en el examen.'
      ]
    },
    {
      id: 'banco',
      title: 'Buscador del Banco',
      tag: '1,500 REACTIVOS',
      tagColor: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
      icon: Search,
      iconColor: 'bg-slate-300 text-slate-950',
      benefit: 'Encuentra cualquier término o código de pregunta para verificar la clave oficial.',
      actionText: 'Buscar en el Banco',
      btnStyle: 'bg-slate-800 hover:bg-slate-700 text-white font-black',
      onAction: () => onNavigateTab('banco'),
      bullets: [
        'Búsqueda por palabras clave como "flagrancia" o "delito".',
        'Guarda preguntas difíciles en Favoritos.',
        'Verifica fundamentación legal oficial.'
      ]
    },
    {
      id: 'custom_sim',
      title: 'Examen Personalizado',
      tag: 'A TU MEDIDA',
      tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      icon: Sliders,
      iconColor: 'bg-purple-400 text-slate-950',
      benefit: 'Arma tus propios examentes combinando únicamente las materias que deseas estudiar.',
      actionText: 'Diseñar Examen',
      btnStyle: 'bg-purple-700 hover:bg-purple-600 text-white font-black',
      onAction: () => onNavigateTab('custom'),
      bullets: [
        'Selecciona varias normas en un solo examen.',
        'Ajusta la cantidad de preguntas y tiempo libre.',
        'Ideal para repasos personalizados de fin de semana.'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* 1. BANNER HERO - ALTO IMPACTO VISUAL Y CONVERSIÓN */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden text-center">
        {/* Adorno brillante */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          
          {/* BADGE OFICIAL */}
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/50 text-amber-400 px-3.5 py-1 rounded-full text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BALOTARIO OFICIAL REVISADO 2026 · RD N° 006857-2026</span>
          </div>

          {/* TITULO HERO */}
          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Asegura tu <span className="text-amber-400 underline decoration-amber-500/60 decoration-wavy">Ascenso PNP 2026</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 font-sans max-w-lg mx-auto">
            El sistema inteligente con <strong className="text-white">1,500 preguntas oficiales</strong>, <strong className="text-emerald-400">Bot de WhatsApp 24/7</strong> y <strong className="text-sky-300">Profesor IA Legal</strong>.
          </p>

          {/* TARJETAS DE MÉTRICAS VISUALES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center max-w-xl mx-auto pt-2 font-mono">
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
              <span className="text-xl sm:text-2xl font-black text-amber-400 block">1,500</span>
              <span className="text-[10px] text-slate-400">Preguntas</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
              <span className="text-xl sm:text-2xl font-black text-emerald-400 block">22</span>
              <span className="text-[10px] text-slate-400">Normas</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
              <span className="text-xl sm:text-2xl font-black text-sky-400 block">24/7</span>
              <span className="text-[10px] text-slate-400">Bot Wsp</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
              <span className="text-xl sm:text-2xl font-black text-purple-400 block">IA</span>
              <span className="text-[10px] text-slate-400">Sustento</span>
            </div>
          </div>

          {/* BOTONES PRINCIPALES CTA */}
          <div className="pt-3 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <a
              href={wspLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black text-sm py-3.5 px-5 rounded-2xl shadow-xl transition-all active-scale flex items-center justify-center gap-2 border border-emerald-400/80"
            >
              <MessageSquare className="w-5 h-5 fill-current shrink-0" />
              <span>CONTRATAR POR WHATSAPP</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => onNavigateTab('dashboard')}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-sm py-3.5 px-5 rounded-2xl shadow-xl transition-all active-scale flex items-center justify-center gap-2 border border-amber-300"
            >
              <Shield className="w-5 h-5 fill-current shrink-0" />
              <span>PROBAR SIMULADOR</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-mono">
            ✓ Acceso instantáneo en Android, iPhone y Laptop.
          </p>

        </div>
      </div>

      {/* 2. SECCIÓN VISUAL DE MÓDULOS DE ACCIÓN */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 inline-flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-500" />
            <span>¿QUÉ PUEDES HACER EN ESTE SIMULADOR?</span>
          </span>
          <h2 className="font-display text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Selecciona la acción de tu preferencia
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto font-sans">
            Presiona el botón de cada tarjeta para empezar a practicar o toca <strong className="text-slate-900 dark:text-white">"[+] Ver detalles"</strong> para desplegar más información.
          </p>
        </div>

        {/* GRILLA ULTRA VISUAL DE ACCIONES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visualModules.map(mod => {
            const Icon = mod.icon;
            const isExpanded = expandedCard === mod.id;

            return (
              <div
                key={mod.id}
                className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 text-slate-900 dark:text-slate-100 shadow-sm hover:border-amber-500/70 transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${mod.tagColor}`}>
                      {mod.tag}
                    </span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${mod.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug font-sans">
                    {mod.benefit}
                  </p>
                </div>

                {/* BOTÓN Y DESPLEGABLE COMPACTO */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={mod.onAction}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all active-scale ${mod.btnStyle}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span>{mod.actionText}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleDetail(mod.id)}
                    className="w-full text-[10px] font-mono font-bold text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 flex items-center justify-center gap-1 py-0.5"
                  >
                    <span>{isExpanded ? 'Ocultar detalles' : '[+] Ver detalles'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {/* DESPLEGABLE EN LÍNEA */}
                  {isExpanded && (
                    <div className="bg-slate-50 dark:bg-slate-900 border border-amber-500/30 rounded-xl p-2.5 text-[11px] space-y-1.5 animate-fadeIn">
                      {mod.bullets.map((b, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300 leading-tight">
                          <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MUESTRA REAL INTERACTIVA CORTA */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 text-slate-900 dark:text-slate-100 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
              MUESTRA EN VIVO
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              BALOTARIO PNP 2026
            </span>
          </div>

          <button
            onClick={() => {
              setSelectedOpt(null);
              setSampleIndex(prev => prev + 1);
            }}
            className="text-xs font-mono font-bold text-slate-600 hover:text-amber-500 dark:text-slate-300 flex items-center gap-1 active-scale"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>Otra pregunta</span>
          </button>
        </div>

        {/* CÓDIGO Y NORMA */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="bg-slate-100 dark:bg-slate-900 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
            CÓDIGO: {sampleQuestion.id}
          </span>
          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold uppercase truncate max-w-[200px]">
            {sampleQuestion.norma}
          </span>
        </div>

        {/* ENUNCIADO */}
        <p className="font-display font-semibold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
          {sampleQuestion.enunciado}
        </p>

        {/* OPCIONES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {sampleQuestion.opciones.map((op, opIdx) => {
            const letra = String.fromCharCode(65 + opIdx);
            const isSelected = selectedOpt === op;
            const isRight = op.trim() === sampleQuestion.respuesta.trim();

            let optionStyle =
              'bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';

            if (selectedOpt !== null) {
              if (isRight) {
                optionStyle = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-500 font-bold';
              } else if (isSelected) {
                optionStyle = 'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200 border-red-500 font-bold';
              }
            }

            return (
              <button
                key={opIdx}
                onClick={() => setSelectedOpt(op)}
                className={`p-2.5 rounded-xl border text-xs font-sans transition-all text-left flex items-start gap-2 active-scale ${optionStyle}`}
              >
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold text-xs bg-amber-500/10 w-5 h-5 rounded flex items-center justify-center shrink-0 border border-amber-500/30">
                  {letra}
                </span>
                <span className="flex-1 leading-tight pt-0.5 text-[11px]">{op}</span>
              </button>
            );
          })}
        </div>

        {/* FEEDBACK */}
        {selectedOpt !== null && (
          <div className="p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-amber-500/40 flex items-center justify-between gap-2 text-xs font-mono">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              Clave oficial: {sampleQuestion.respuesta}
            </span>
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded text-[11px] active-scale"
            >
              Ir al Portal
            </button>
          </div>
        )}
      </div>

      {/* 4. BANNER FINAL CTA DE CONVERSIÓN */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-2 border-emerald-500/80 rounded-3xl p-6 text-white shadow-xl text-center space-y-4">
        <Award className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="font-display text-2xl sm:text-3xl font-black">
          ¡Asegura tu Vacante de Ascenso PNP 2026!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Prueba las herramientas gratis o contáctanos por WhatsApp para activar tu acceso al Balotario Oficial de 1,500 preguntas.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-1">
          <a
            href={wspLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2 border border-emerald-300"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>CONTRATAR POR WHATSAPP</span>
          </a>

          <button
            onClick={() => onNavigateTab('dashboard')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-black text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2 border border-amber-300"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>INGRESAR AL SIMULADOR</span>
          </button>
        </div>
      </div>

      {/* PIE REGULATORIO */}
      <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        <span>RD N° 006857-2026-DIRREHUM-PNP/JE — Centro de Evaluación PNP 2026</span>
      </div>

    </div>
  );
};
