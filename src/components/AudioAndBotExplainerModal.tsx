import React, { useState } from 'react';
import { Volume2, MessageSquare, X, Play, CheckCircle2, Smartphone, Headphones, Shield, ArrowRight, Zap, BookOpen } from 'lucide-react';
import { AudioButton } from './AudioButton';

interface AudioAndBotExplainerModalProps {
  onClose: () => void;
  onOpenWhatsAppSimulator?: () => void;
}

export const AudioAndBotExplainerModal: React.FC<AudioAndBotExplainerModalProps> = ({
  onClose,
  onOpenWhatsAppSimulator,
}) => {
  const [activeTab, setActiveTab] = useState<'AUDIO' | 'WHATSAPP'>('AUDIO');

  const ejemploPregunta = {
    id: 101,
    enunciado: '¿Cuál es el plazo máximo constitucional de detención policial en caso de flagrancia delictiva común según el Artículo 2, inciso 24 de la Constitución Política del Perú?',
    opciones: [
      '24 horas desde la intervención policial.',
      '48 horas, o en el término de la distancia.',
      '72 horas bajo control jurisdiccional.',
      '15 días naturales improrrogables.',
    ],
    respuestaCorrecta: 1,
    explicacion: 'De conformidad con el Artículo 2, inciso 24, literal f) de la Constitución, la detención policial en flagrancia común dura un máximo de 48 horas o el término de la distancia.',
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-in fade-in zoom-in duration-200 text-slate-900 dark:text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 border border-amber-400 flex items-center justify-center shrink-0 shadow-md">
            <Headphones className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              TECNOLOGÍA EN TU PREPARACIÓN PNP
            </span>
            <h2 className="font-serif font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white mt-1">
              ¿Cómo funciona la Audio-Lectura y el Bot de WhatsApp?
            </h2>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('AUDIO')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'AUDIO'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>1. Lectura en Voz Alta (Audio)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('WHATSAPP')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'WHATSAPP'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>2. Bot de WhatsApp PNP</span>
          </button>
        </div>

        {/* Content Section */}
        {activeTab === 'AUDIO' ? (
          <div className="space-y-5">
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-2">
              <h3 className="font-display font-bold text-sm sm:text-base text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Estudia sin cansar la vista en patrullaje o descanso
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                El sistema incorpora un motor de voz neuronal nativo que lee en voz alta la pregunta legal, sus alternativas de respuesta y la sustentación en la Constitución y Leyes Policiales.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                ✨ Pruébalo en vivo con esta pregunta de ejemplo:
              </h4>

              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 space-y-3 shadow-inner">
                <div className="flex items-start justify-between gap-3">
                  <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold px-2.5 py-1 rounded-lg">
                    PREGUNTA #101 · CONSTITUCIÓN POLÍTICA
                  </span>
                  {/* LIVE TEST AUDIO BUTTON */}
                  <AudioButton
                    text={`${ejemploPregunta.enunciado}. Alternativas: A: ${ejemploPregunta.opciones[0]}. B: ${ejemploPregunta.opciones[1]}. C: ${ejemploPregunta.opciones[2]}. D: ${ejemploPregunta.opciones[3]}. Respuesta correcta: B. ${ejemploPregunta.explicacion}`}
                    label="Escuchar Pregunta en Voz Alta"
                  />
                </div>

                <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white leading-relaxed">
                  {ejemploPregunta.enunciado}
                </p>

                <div className="grid grid-cols-1 gap-2 pt-1">
                  {ejemploPregunta.opciones.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`text-xs sm:text-sm p-3 rounded-xl border font-sans ${
                        idx === 1
                          ? 'bg-emerald-500/10 border-emerald-500/60 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-mono font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                <strong className="block text-slate-900 dark:text-white mb-1">🚗 En tránsito:</strong>
                <span className="text-slate-500 dark:text-slate-400">Escucha balotarios mientras conduces o vas de servicio.</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                <strong className="block text-slate-900 dark:text-white mb-1">🎧 Con audífonos:</strong>
                <span className="text-slate-500 dark:text-slate-400">Repaso silencioso durante retenes o esperas en comisaría.</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                <strong className="block text-slate-900 dark:text-white mb-1">⚡ Sin datos extra:</strong>
                <span className="text-slate-500 dark:text-slate-400">Opera directamente desde el sintetizador de voz de tu teléfono.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl space-y-2">
              <h3 className="font-display font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Tu Tutor Personal de Ascenso PNP 24/7 en WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                Cuando ingresas tu celular en el Portal, vinculamos tu cuenta con el Bot Oficial. Podrás repasar normas y consultas en cualquier momento desde WhatsApp sin abrir el navegador.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                💬 Comandos oficiales que puedes enviarle por WhatsApp:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-2xl space-y-1">
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    #simulacro
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    El bot te envía 5 preguntas rápidas en formato interactivo para resolver en un minuto.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-2xl space-y-1">
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    #penal o #constitucion
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Recibe un minitest de la norma que pidas con sustento legal y artículos clave.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-2xl space-y-1">
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    #falladas
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Te repite por WhatsApp únicamente las preguntas en las que te equivocaste antes.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-2xl space-y-1">
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    📸 Enviar foto o duda
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Puedes tomarle foto a una pregunta o ley y el bot te citará el artículo legal oficial.
                  </p>
                </div>
              </div>
            </div>

            {onOpenWhatsAppSimulator && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenWhatsAppSimulator();
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold py-3.5 rounded-2xl text-sm shadow-lg transition-all flex items-center justify-center gap-2 active-scale"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>ABRIR SIMULADOR INTERACTIVO DE WHATSAPP AHORA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
