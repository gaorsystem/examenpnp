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
  const [filtroRevision, setFiltroRevision] = React.useState<'todas' | 'fallas' | 'aciertos'>('todas');
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
    <div className="max-w-6xl mx-auto space-y-6 pb-12 print:p-0 bg-slate-50 dark:bg-[#01241a] text-slate-900 dark:text-white p-2 sm:p-4 rounded-3xl min-h-screen">
      {/* Header Box */}
      <div className="bg-emerald-700 dark:bg-[#004d38] border border-slate-200 dark:border-emerald-700/60 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden text-center space-y-4">
        <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-400"></div>

        <div className="inline-block bg-emerald-950 text-emerald-600 dark:text-emerald-300 border border-slate-300 dark:border-emerald-600/60 px-3 py-1 rounded-xl font-mono text-xs font-bold uppercase tracking-widest">
          RESULTADO OFICIAL DE ENSAYO DE ASCENSO PNP
        </div>

        <h1 className="font-display text-3xl md:text-5xl font-black text-white">
          {porcentaje}% DE DOMINIO
        </h1>

        <div className="flex items-center justify-center gap-3">
          <span
            className={`px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase border ${
              esAprobado
                ? 'bg-emerald-950 text-emerald-600 dark:text-emerald-300 border-emerald-500/60'
                : 'bg-red-950 text-red-300 border-red-500/60'
            }`}
          >
            {esAprobado ? 'APROBADO (Apto para el Concurso)' : 'REQUIERE REFUERZO Y REPASO'}
          </span>
        </div>

        <p className="text-xs md:text-sm text-emerald-700 dark:text-slate-500 dark:text-emerald-200/90 max-w-xl mx-auto font-sans leading-relaxed">
          {userProfile.grado} {userProfile.nombre} (CIP: {userProfile.cip}) · Modo: {intento.modo.toUpperCase()}
        </p>

        {/* Score Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4 border-t border-slate-200 dark:border-emerald-700/60 text-center font-mono">
          <div className="bg-slate-100 dark:bg-[#003829] p-3 rounded-xl border border-slate-200 dark:border-emerald-700/60">
            <span className="text-xs text-emerald-700 dark:text-emerald-200/80 block">Aciertos</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-300">{intento.aciertos}</span>
          </div>

          <div className="bg-slate-100 dark:bg-[#003829] p-3 rounded-xl border border-slate-200 dark:border-emerald-700/60">
            <span className="text-xs text-emerald-700 dark:text-emerald-200/80 block">Erradas</span>
            <span className="text-xl font-bold text-red-400">{falladasCount}</span>
          </div>

          <div className="bg-slate-100 dark:bg-[#003829] p-3 rounded-xl border border-slate-200 dark:border-emerald-700/60">
            <span className="text-xs text-emerald-700 dark:text-emerald-200/80 block">Total</span>
            <span className="text-xl font-bold text-white">{intento.totalPreguntas}</span>
          </div>

          <div className="bg-slate-100 dark:bg-[#003829] p-3 rounded-xl border border-slate-200 dark:border-emerald-700/60">
            <span className="text-xs text-emerald-700 dark:text-emerald-200/80 block">Tiempo</span>
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
            className="bg-slate-100 dark:bg-[#003829] hover:bg-emerald-900 text-emerald-700 dark:text-emerald-200 border border-slate-300 dark:border-emerald-600 px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all active-scale"
          >
            <Printer className="w-4 h-4" />
            Imprimir Constancia
          </button>
        </div>
      </div>

      {/* Breakdown by Norma / Materia */}
      <div className="bg-emerald-700 dark:bg-[#004d38] border border-slate-200 dark:border-emerald-700/60 rounded-3xl p-6 text-white shadow-sm space-y-4">
        <h3 className="font-display text-lg font-bold text-white border-b border-slate-200 dark:border-emerald-700/60 pb-2 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
          Rendimiento Detallado por Materia
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(normStats).map(([norma, stat], idx) => {
            const pct = Math.round((stat.ok / stat.total) * 100);

            return (
              <div
                key={idx}
                className="bg-slate-100 dark:bg-[#003829] border border-slate-200 dark:border-emerald-700/60 rounded-xl p-3 text-xs space-y-2"
              >
                <div className="flex justify-between items-start font-mono">
                  <span className="text-white font-semibold line-clamp-1 flex-1 pr-2">
                    {norma}
                  </span>
                  <span className={`font-bold shrink-0 ${pct >= 70 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-400'}`}>
                    {stat.ok}/{stat.total} ({pct}%)
                  </span>
                </div>

                <div className="w-full bg-emerald-950 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-emerald-700/60">
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
      <div className="bg-emerald-700 dark:bg-[#004d38] border border-slate-200 dark:border-emerald-700/60 rounded-3xl p-6 text-white shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-emerald-700/60 pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
              Revisión Detallada de Preguntas y Claves
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-200/80 mt-0.5">
              Revisa tus respuestas, comprueba en qué fallaste y consulta la base legal oficial de cada reactivo.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-[#003829] p-1 rounded-xl border border-slate-200 dark:border-emerald-700/60 text-xs font-mono overflow-x-auto scrollbar-none whitespace-nowrap">
            <button
              onClick={() => setFiltroRevision('todas')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                filtroRevision === 'todas'
                  ? 'bg-emerald-400 text-slate-950 shadow-sm'
                  : 'text-emerald-700 dark:text-emerald-200 hover:text-white'
              }`}
            >
              Todas ({intento.totalPreguntas})
            </button>
            <button
              onClick={() => setFiltroRevision('fallas')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1.5 ${
                filtroRevision === 'fallas'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-red-300 hover:text-white'
              }`}
            >
              <span>Fallas</span>
              <span className="bg-red-950/80 px-1.5 py-0.2 rounded-full text-[10px]">
                {falladasCount}
              </span>
            </button>
            <button
              onClick={() => setFiltroRevision('aciertos')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1.5 ${
                filtroRevision === 'aciertos'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-emerald-600 dark:text-emerald-300 hover:text-white'
              }`}
            >
              <span>Aciertos</span>
              <span className="bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 px-1.5 py-0.2 rounded-full text-[10px]">
                {intento.aciertos}
              </span>
            </button>
          </div>
        </div>

        {/* List of Questions according to filter */}
        <div className="space-y-4">
          {intento.respuestas
            .filter((resp) => {
              if (filtroRevision === 'fallas') return !resp.esCorrecta;
              if (filtroRevision === 'aciertos') return resp.esCorrecta;
              return true;
            })
            .map((resp, idx) => {
              const q = BANCO_PREGUNTAS.find(
                (p) => p.id === resp.preguntaId || String(p.numero) === resp.preguntaId
              );
              if (!q) return null;

              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-2xl border text-xs font-sans space-y-3 transition-all ${
                    resp.esCorrecta
                      ? 'bg-slate-100 dark:bg-[#003829]/90 border-slate-300 dark:border-emerald-600/50'
                      : 'bg-red-950/40 border-red-500/70 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 dark:text-emerald-300 font-bold text-xs bg-[#00261c] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-emerald-700/60">
                        PREGUNTA #{q.numero}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-300/80 uppercase font-semibold hidden sm:inline">
                        {q.norma}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 ${
                        resp.esCorrecta
                          ? 'bg-emerald-900/80 text-emerald-700 dark:text-emerald-200 border border-emerald-500/60'
                          : 'bg-red-900/80 text-red-200 border border-red-500/80 animate-pulse'
                      }`}
                    >
                      {resp.esCorrecta ? '✓ ACERTADA' : '✗ INCORRECTA'}
                    </span>
                  </div>

                  <p className="font-display font-semibold text-sm sm:text-base text-white leading-tight">
                    {q.enunciado}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-emerald-700/60 font-mono text-xs">
                    {/* User Selection */}
                    <div
                      className={`p-3 rounded-xl border ${
                        resp.esCorrecta
                          ? 'bg-emerald-950/60 border-slate-300 dark:border-emerald-600/60 text-emerald-700 dark:text-emerald-200'
                          : 'bg-red-950/80 border-red-600/80 text-red-100'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75 mb-0.5">
                        {resp.esCorrecta ? '✓ Tu respuesta seleccionada:' : '✗ Tu respuesta errada:'}
                      </span>
                      <span className="font-bold">
                        {resp.opcionElegida || 'Sin responder (Tiempo agotado)'}
                      </span>
                    </div>

                    {/* Official Correct Answer */}
                    <div className="p-3 rounded-xl border bg-emerald-950 border-emerald-500/80 text-emerald-100">
                      <span className="text-[10px] uppercase font-bold tracking-wider block text-emerald-400 mb-0.5">
                        ★ Clave Oficial Correcta:
                      </span>
                      <span className="font-bold text-white">
                        {q.respuesta}
                      </span>
                    </div>
                  </div>

                  {q.ubicacion && (
                    <div className="bg-[#00261c] px-3 py-2 rounded-xl border border-emerald-800/80 text-emerald-700 dark:text-emerald-200 text-[11px] flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400 shrink-0">
                        Base Legal:
                      </span>
                      <span className="italic">{q.ubicacion}</span>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
