import React, { useState } from 'react';
import { Search, Shield, Bookmark, CheckCircle, FileText, Filter, BookOpen } from 'lucide-react';
import { Pregunta, GrupoMateria } from '../types';
import { buscarPreguntas, getNormasInfo } from '../data/questionsData';
import { getFavoritos, toggleFavorito } from '../lib/srsStorage';

export const QuestionBankScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [grupoFiltro, setGrupoFiltro] = useState<string>('');
  const [normaFiltro, setNormaFiltro] = useState<string>('');
  const [favoritosOnly, setFavoritosOnly] = useState<boolean>(false);
  const [selectedPregunta, setSelectedPregunta] = useState<Pregunta | null>(null);
  const [favoritos, setFavoritos] = useState<string[]>(() => getFavoritos());

  const normas = getNormasInfo();
  let resultados = buscarPreguntas(query, normaFiltro || undefined, grupoFiltro || undefined);

  if (favoritosOnly) {
    resultados = resultados.filter((q) => favoritos.includes(q.id));
  }

  const handleToggleFav = (preguntaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorito(preguntaId);
    setFavoritos(getFavoritos());
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Search Bar */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 text-slate-900 dark:text-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-6 h-6 text-amber-500" />
              Catálogo y Banco Oficial (1,500 Preguntas)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              Buscador directo por código oficial PNP, palabra clave, norma o artículo de ley
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="bg-slate-100 dark:bg-slate-900 text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl font-bold">
              {resultados.length} preguntas encontradas
            </span>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar (ej. 180838, arresto, código penal)..."
              className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl pl-9 pr-3 py-2.5 w-full focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>

          {/* Grupo Filter */}
          <select
            value={grupoFiltro}
            onChange={(e) => setGrupoFiltro(e.target.value)}
            className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 font-mono"
          >
            <option value="">Todos los Grupos (Comunes y Especialidad)</option>
            <option value="COMUNES">Materias Comunes</option>
            <option value="ESPECIALIDAD">Materias de Especialidad</option>
          </select>

          {/* Norma Filter */}
          <select
            value={normaFiltro}
            onChange={(e) => setNormaFiltro(e.target.value)}
            className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 font-mono truncate"
          >
            <option value="">Todas las Normas (22 Fuentes)</option>
            {normas.map((n) => (
              <option key={n.id} value={n.nombre}>
                {n.nombre.length > 40 ? n.nombre.substring(0, 40) + '...' : n.nombre} ({n.totalPreguntas})
              </option>
            ))}
          </select>

          {/* Favoritos Toggle */}
          <button
            onClick={() => setFavoritosOnly(!favoritosOnly)}
            className={`px-3 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 border transition-colors ${
              favoritosOnly
                ? 'bg-red-600 text-white border-red-500 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${favoritosOnly ? 'fill-current' : ''}`} />
            Marcadas ({favoritos.length})
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {resultados.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <Search className="w-10 h-10 text-amber-500 mx-auto opacity-50" />
            <h4 className="font-display text-lg text-slate-900 dark:text-white font-semibold">No hay preguntas que coincidan</h4>
            <p className="text-xs">Intenta cambiar las palabras clave o borrar los filtros seleccionados.</p>
          </div>
        ) : (
          resultados.slice(0, 50).map((q) => {
            const isFav = favoritos.includes(q.id);
            const isSelected = selectedPregunta?.id === q.id;

            return (
              <div
                key={q.id}
                onClick={() => setSelectedPregunta(isSelected ? null : q)}
                className={`bg-white dark:bg-slate-800/80 border rounded-2xl p-4 transition-all cursor-pointer shadow-sm hover:border-amber-500 ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-500/5'
                    : 'border-slate-200 dark:border-slate-700/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md">
                      CÓD. {q.id}
                    </span>
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        q.grupo === 'COMUNES'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {q.grupo}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono line-clamp-1">
                      {q.norma}
                    </span>
                    <button
                      onClick={(e) => handleToggleFav(q.id, e)}
                      className={`p-1 rounded transition-colors ${
                        isFav ? 'text-red-500' : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <p className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  {q.enunciado}
                </p>

                {/* Expanded Details & Options Key */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/80 space-y-3 animate-fadeIn">
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase block">
                      Alternativas y Clave Oficial:
                    </span>

                    <div className="space-y-1.5 pl-2">
                      {q.opciones.map((op, opIdx) => {
                        const letra = String.fromCharCode(65 + opIdx);
                        const esCorrecta = op.trim() === q.respuesta.trim();

                        return (
                          <div
                            key={opIdx}
                            className={`p-2 rounded-xl text-xs font-sans flex items-start gap-2 ${
                              esCorrecta
                                ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-900 dark:text-emerald-100 font-bold'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{letra}.</span>
                            <span className="flex-1">{op}</span>
                            {esCorrecta && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {q.ubicacion && (
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-2">
                        <FileText className="w-3.5 h-3.5 text-amber-500" />
                        <span>Ubicación legal: {q.ubicacion}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        {resultados.length > 50 && (
          <div className="text-center text-xs font-mono text-slate-500 dark:text-slate-400 pt-2">
            Mostrando 50 de {resultados.length} preguntas. Usa el buscador para afinar la búsqueda.
          </div>
        )}
      </div>
    </div>
  );
};
