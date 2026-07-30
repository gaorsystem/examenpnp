import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, XCircle, Shield, Award, RotateCcw, HelpCircle, Smartphone } from 'lucide-react';
import { UserProfile, Pregunta } from '../types';
import { BANCO_PREGUNTAS, barajar } from '../data/questionsData';
import { actualizarProgresoSRS } from '../lib/srsStorage';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  pregunta?: Pregunta;
  options?: string[];
  answered?: boolean;
  selectedOption?: string;
  isCorrect?: boolean;
}

interface WhatsAppBotSimulatorProps {
  userProfile: UserProfile;
}

export const WhatsAppBotSimulator: React.FC<WhatsAppBotSimulatorProps> = ({ userProfile }) => {
  const getHora = () =>
    new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

  const getPreguntaAleatoria = (): Pregunta => {
    const list = barajar(BANCO_PREGUNTAS);
    return list[0];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initialQuestion = getPreguntaAleatoria();
    return [
      {
        id: 'msg_1',
        sender: 'bot',
        text: `👮‍♂️ ¡Atención ${userProfile.grado} ${userProfile.nombre}! Bienvenido al Bot de Entrenamiento Diario PNP (Ascenso 2026).\n\nAquí tienes tu pregunta del día para mantener tu racha de preparación:`,
        time: getHora(),
      },
      {
        id: 'msg_2',
        sender: 'bot',
        text: `📌 CÓDIGO: ${initialQuestion.id}\n📖 MATERIA: ${initialQuestion.norma}\n\n${initialQuestion.enunciado}`,
        time: getHora(),
        pregunta: initialQuestion,
        options: initialQuestion.opciones,
        answered: false,
      },
    ];
  });

  const [inputVal, setInputVal] = useState('');

  const handleAnswerQuestion = (msgId: string, pregunta: Pregunta, opcionElegida: string) => {
    const esCorrecta = opcionElegida.trim() === pregunta.respuesta.trim();

    // Actualizar SRS
    actualizarProgresoSRS(pregunta.id, esCorrecta);

    // Marcar el mensaje de la pregunta como respondido
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? {
              ...m,
              answered: true,
              selectedOption: opcionElegida,
              isCorrect: esCorrecta,
            }
          : m
      )
    );

    // Agregar respuesta del usuario y réplica del bot
    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: opcionElegida,
      time: getHora(),
    };

    const feedbackText = esCorrecta
      ? `✅ ¡EXCELENTE MI OFICIAL! Respuesta Correcta.\n\n📖 Norma: ${pregunta.norma}\n📍 Cita: ${pregunta.ubicacion || 'Banco Oficial RD N° 006857-2026'}\n\n¡Has sumado puntos de racha diaria!`
      : `❌ INCORRECTO MI OFICIAL.\n\n💡 La respuesta correcta es:\n"${pregunta.respuesta}"\n\n📖 Norma: ${pregunta.norma}\n📍 Cita: ${pregunta.ubicacion || 'Banco Oficial RD N° 006857-2026'}`;

    const botFeedbackMsg: ChatMessage = {
      id: `msg_b_${Date.now()}`,
      sender: 'bot',
      text: feedbackText,
      time: getHora(),
    };

    // Siguiente pregunta
    const nextQ = getPreguntaAleatoria();
    const nextQMsg: ChatMessage = {
      id: `msg_q_${Date.now() + 1}`,
      sender: 'bot',
      text: `📌 CÓDIGO: ${nextQ.id}\n📖 MATERIA: ${nextQ.norma}\n\n${nextQ.enunciado}`,
      time: getHora(),
      pregunta: nextQ,
      options: nextQ.opciones,
      answered: false,
    };

    setMessages((prev) => [...prev, userMsg, botFeedbackMsg, nextQMsg]);
  };

  const handleSendCustomMessage = () => {
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');

    const userMsg: ChatMessage = {
      id: `msg_custom_u_${Date.now()}`,
      sender: 'user',
      text: userText,
      time: getHora(),
    };

    const nextQ = getPreguntaAleatoria();
    const botReply: ChatMessage = {
      id: `msg_custom_b_${Date.now()}`,
      sender: 'bot',
      text: `Comprendido ${userProfile.grado}. Aquí tienes una nueva pregunta de práctica para reforzar tus conocimientos:`,
      time: getHora(),
    };

    const nextQMsg: ChatMessage = {
      id: `msg_q_${Date.now() + 1}`,
      sender: 'bot',
      text: `📌 CÓDIGO: ${nextQ.id}\n📖 MATERIA: ${nextQ.norma}\n\n${nextQ.enunciado}`,
      time: getHora(),
      pregunta: nextQ,
      options: nextQ.opciones,
      answered: false,
    };

    setMessages((prev) => [...prev, userMsg, botReply, nextQMsg]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-12">
      {/* Bot Info Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 text-slate-900 dark:text-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              Bot Oficial PNP WhatsApp
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {userProfile.telefonoWhatsapp} · En línea
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const nextQ = getPreguntaAleatoria();
            const qMsg: ChatMessage = {
              id: `msg_manual_${Date.now()}`,
              sender: 'bot',
              text: `📌 CÓDIGO: ${nextQ.id}\n📖 MATERIA: ${nextQ.norma}\n\n${nextQ.enunciado}`,
              time: getHora(),
              pregunta: nextQ,
              options: nextQ.opciones,
              answered: false,
            };
            setMessages((prev) => [...prev, qMsg]);
          }}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-700 text-slate-800 dark:text-amber-400 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 active-scale"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Otra Pregunta
        </button>
      </div>

      {/* WhatsApp Window Box */}
      <div className="bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[550px]">
        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
          {messages.map((m) => {
            const isBot = m.sender === 'bot';

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs md:text-sm font-sans whitespace-pre-wrap leading-relaxed shadow-sm ${
                    isBot
                      ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                      : 'bg-emerald-700 text-white rounded-tr-none'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Options if attached */}
                  {m.options && m.pregunta && (
                    <div className="mt-3 pt-3 border-t border-slate-700 space-y-1.5">
                      {m.options.map((op, idx) => {
                        const letra = String.fromCharCode(65 + idx);
                        const isSelected = m.selectedOption === op;
                        const isRight = op.trim() === m.pregunta?.respuesta.trim();

                        let optBtnStyle =
                          'bg-slate-900 hover:bg-slate-950 text-slate-100 border-slate-700';

                        if (m.answered) {
                          if (isRight) {
                            optBtnStyle = 'bg-emerald-500/20 text-emerald-200 border-emerald-500 font-bold';
                          } else if (isSelected) {
                            optBtnStyle = 'bg-red-500/20 text-red-200 border-red-500 font-bold';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={m.answered}
                            onClick={() => handleAnswerQuestion(m.id, m.pregunta!, op)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs font-sans transition-all flex items-start gap-2 ${optBtnStyle}`}
                          >
                            <span className="font-mono text-amber-400 font-bold">{letra}.</span>
                            <span className="flex-1">{op}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block text-right mt-1 font-mono">
                    {m.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-slate-800 border-t border-slate-700 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendCustomMessage()}
            placeholder="Escribe una consulta o presiona Enter para pedir pregunta..."
            className="flex-1 bg-slate-900 text-slate-100 text-xs rounded-full px-4 py-2.5 focus:outline-none placeholder-slate-400 font-sans border border-slate-700"
          />
          <button
            onClick={handleSendCustomMessage}
            className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shrink-0 transition-colors shadow-sm active-scale"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
