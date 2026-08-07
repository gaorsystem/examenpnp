import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowLeft, Printer, Award, FileText } from 'lucide-react';
import { IntentoExamen, UserProfile } from '../types';
import { BANCO_PREGUNTAS } from '../data/questionsData';

interface ExamResultsScreenProps {
  intento: IntentoExamen;
  userProfile: UserProfile;
  onRetryFailures: () => void;
  onBackToDashboard: () => void;
}

export const ExamResultsScreen: React.FC<ExamResultsScreenProps> = ({
  intento,
  userProfile,
  onRetryFailures,
  onBackToDashboard,
}) => {
  const porcentaje = Math.round((intento.aciertos / intento.totalPreguntas) * 100);
  const esAprobado = porcentaje >= 65;

  useEffect(() => {
    if (esAprobado) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#ffffff'],
      });
    }
  }, [esAprobado]);

  const mins = Math.floor(intento.duracionSeg / 60);
  const secs = intento.duracionSeg % 60;

  // Group performance by norm
  const normStats: Record<string, { ok: number; total: number }> = {};
  intento.respuestas.forEach((resp) => {
    const q = BANCO_PREGUNTAS.find((p) => p.id === resp.preguntaId);
    if (q) {
      if (!normStats[q.norma]) normStats[q.norma] = { ok: 0, total: 0 };
      normStats[q.norma].total += 1;
      if (resp.esCorrecta) normStats[q.norma].ok += 1;
    }
  });

  const falladasCount = intento.totalPreguntas - intento.aciertos;

  const handlePrintCertificado = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 print:p-0 bg-[#01241a] text-white p-2 sm:p-4 rounded-3xl min-h-screen">
      {/* Header Box */}
      <div className="bg-[#004d38] border border-emerald-700/60 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden text-center space-y-4">
        <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-400"></div>

        <div className="inline-block bg-emerald-950 text-emerald-300 border border-emerald-600/60 px-3 py-1 rounded-xl font-mono text-xs font-bold uppercase tracking-widest">
          RESULTADO OFICIAL DE ENSAYO DE ASCENSO PNP
        </div>

        <h1 className="font-display text-3xl md:text-5xl font-black text-white">
          {porcentaje}% DE DOMINIO
        </h1>

        <div className="flex items-center justify-center gap-3">
          <span
            className={`px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase border ${
              esAprobado
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60'
                : 'bg-red-950 text-red-300 border-red-500/60'
            }`}
          >
            {esAprobado ? 'APROBADO (Apto para el Concurso)' : 'REQUIERE REFUERZO Y REPASO'}
          </span>
        </div>

        <p className="text-xs md:text-sm text-emerald-200/90 max-w-xl mx-auto font-sans leading-relaxed">
          {userProfile.grado} {userProfile.nombre} (CIP: {userProfile.cip}) · Modo: {intento.modo.toUpperCase()}
        </p>

        {/* Score Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4 border-t border-emerald-700/60 text-center font-mono">
          <div className="bg-[#003829] p-3 rounded-xl border border-emerald-700/60">
            <span className="text-xs text-emerald-200/80 block">Aciertos</span>
            <span className="text-xl font-bold text-emerald-300">{intento.aciertos}</span>
          </div>

          <div className="bg-[#003829] p-3 rounded-xl border border-emerald-700/60">
            <span className="text-xs text-emerald-200/80 block">Erradas</span>
            <span className="text-xl font-bold text-red-400">{falladasCount}</span>
          </div>

          <div className="bg-[#003829] p-3 rounded-xl border border-emerald-700/60">
            <span className="text-xs text-emerald-200/80 block">Total</span>
            <span className="text-xl font-bold text-white">{intento.totalPreguntas}</span>
          </div>

          <div className="bg-[#003829] p-3 rounded-xl border border-emerald-700/60">
            <span className="text-xs text-emerald-200/80 block">Tiempo</span>
            <span className="text-xl font-bold text-white">
              {mins}m {secs}s
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 print:hidden">
          {falladasCount > 0 && (
            <button
              onClick={onRetryFailures}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 shadow-sm transition-all active-scale"
            >
              <RotateCcw className="w-4 h-4" />
              Repasar solo mis fallas ({falladasCount})
            </button>
          )}

          <button
            onClick={onBackToDashboard}
            className="bg-white hover:bg-emerald-50 text-[#01241a] px-6 py-2.5 rounded-xl font-display font-black text-xs flex items-center gap-2 shadow-lg transition-all active-scale"
          >
            <ArrowLeft className="w-4 h-4" />
            VOLVER AL PORTAL
          </button>

          <button
            onClick={handlePrintCertificado}
            className="bg-[#003829] hover:bg-emerald-900 text-emerald-200 border border-emerald-600 px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all active-scale"
          >
            <Printer className="w-4 h-4" />
            Imprimir Constancia
          </button>
        </div>
      </div>

      {/* Breakdown by Norma / Materia */}
      <div className="bg-[#004d38] border border-emerald-700/60 rounded-3xl p-6 text-white shadow-sm space-y-4">
        <h3 className="font-display text-lg font-bold text-white border-b border-emerald-700/60 pb-2 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-300" />
          Rendimiento Detallado por Materia
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(normStats).map(([norma, stat], idx) => {
            const pct = Math.round((stat.ok / stat.total) * 100);

            return (
              <div
                key={idx}
                className="bg-[#003829] border border-emerald-700/60 rounded-xl p-3 text-xs space-y-2"
              >
                <div className="flex justify-between items-start font-mono">
                  <span className="text-white font-semibold line-clamp-1 flex-1 pr-2">
                    {norma}
                  </span>
                  <span className={`font-bold shrink-0 ${pct >= 70 ? 'text-emerald-300' : 'text-red-400'}`}>
                    {stat.ok}/{stat.total} ({pct}%)
                  </span>
                </div>

                <div className="w-full bg-emerald-950 h-2 rounded-full overflow-hidden border border-emerald-700/60">
                  <div
                    className={`h-full rounded-full ${pct >= 70 ? 'bg-emerald-400' : 'bg-red-500'}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Question Review List */}
      <div className="bg-[#004d38] border border-emerald-700/60 rounded-3xl p-6 text-white shadow-sm space-y-4">
        <h3 className="font-display text-lg font-bold text-white border-b border-emerald-700/60 pb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-300" />
          Revisión Completa de Preguntas y Respuestas
        </h3>

        <div className="space-y-4">
          {intento.respuestas.map((resp, idx) => {
            const q = BANCO_PREGUNTAS.find((p) => p.id === resp.preguntaId);
            if (!q) return null;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border text-xs font-sans space-y-2 ${
                  resp.esCorrecta
                    ? 'bg-[#003829] border-emerald-500/60'
                    : 'bg-red-950/60 border-red-500/60'
                }`}
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="text-emerald-300 font-bold">
                    #{idx + 1} · CÓDIGO: {q.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold uppercase ${
                      resp.esCorrecta
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/60'
                        : 'bg-red-950 text-red-300 border border-red-600/60'
                    }`}
                  >
                    {resp.esCorrecta ? 'Correcta' : 'Incorrecta'}
                  </span>
                </div>

                <p className="font-display font-semibold text-sm text-white leading-snug">
                  {q.enunciado}
                </p>

                <div className="space-y-1 font-mono text-[11px] pt-1 border-t border-emerald-700/60">
                  <div className="text-emerald-200">
                    <strong>Tu elección:</strong>{' '}
                    <span className={resp.esCorrecta ? 'text-emerald-300 font-bold' : 'text-red-300 font-bold'}>
                      {resp.opcionElegida || 'Sin responder'}
                    </span>
                  </div>

                  {!resp.esCorrecta && (
                    <div className="text-emerald-300">
                      <strong>Clave Correcta:</strong> {q.respuesta}
                    </div>
                  )}

                  {q.ubicacion && (
                    <div className="text-emerald-200/70 italic pt-0.5">
                      Base legal: {q.ubicacion}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
