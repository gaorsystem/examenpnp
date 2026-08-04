import { Pregunta, NormaInfo, GrupoMateria } from '../types';
import rawQuestions from './rawQuestions.json';

// Mapeo del JSON oficial a la interfaz de Pregunta
export const BANCO_PREGUNTAS: Pregunta[] = (rawQuestions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: (q.materia_grupo === 'COMUNES' ? 'COMUNES' : 'ESPECIALIDAD') as GrupoMateria,
  norma: q.norma,
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

// Generar lista única de normas/materias con su grupo y recuento
export function getNormasInfo(): NormaInfo[] {
  const map = new Map<string, { grupo: GrupoMateria; count: number }>();

  BANCO_PREGUNTAS.forEach((q) => {
    const existing = map.get(q.norma);
    if (existing) {
      existing.count++;
    } else {
      map.set(q.norma, { grupo: q.grupo, count: 1 });
    }
  });

  let idCounter = 1;
  const list: NormaInfo[] = [];

  map.forEach((value, key) => {
    const slug = key
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    list.push({
      id: idCounter++,
      nombre: key,
      grupo: value.grupo,
      slug,
      totalPreguntas: value.count,
    });
  });

  return list;
}

// Mezcla aleatoria Fisher-Yates
export function barajar<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Genera un examen simulacro balanceado (50% Comunes, 50% Especialidad)
export function generarExamenSimulacro(numPreguntas: number = 20): Pregunta[] {
  const mitad = Math.floor(numPreguntas / 2);
  const comunes = barajar(BANCO_PREGUNTAS.filter((q) => q.grupo === 'COMUNES')).slice(0, mitad);
  const especialidad = barajar(BANCO_PREGUNTAS.filter((q) => q.grupo === 'ESPECIALIDAD')).slice(0, numPreguntas - mitad);
  return barajar([...comunes, ...especialidad]);
}

// Obtener preguntas por norma
export function getPreguntasPorNorma(normaNombre: string): Pregunta[] {
  return BANCO_PREGUNTAS.filter((q) => q.norma === normaNombre);
}

// Obtener preguntas por grupo (COMUNES / ESPECIALIDAD)
export function getPreguntasPorGrupo(grupo: GrupoMateria): Pregunta[] {
  return BANCO_PREGUNTAS.filter((q) => q.grupo === grupo);
}

// Buscar preguntas por término o código oficial
export function buscarPreguntas(query: string, normaFiltro?: string, grupoFiltro?: string): Pregunta[] {
  const term = query.toLowerCase().trim();
  return BANCO_PREGUNTAS.filter((q) => {
    const matchNorma = !normaFiltro || q.norma === normaFiltro;
    const matchGrupo = !grupoFiltro || q.grupo === grupoFiltro;
    if (!matchNorma || !matchGrupo) return false;

    if (!term) return true;

    return (
      q.id.toLowerCase().includes(term) ||
      q.enunciado.toLowerCase().includes(term) ||
      q.norma.toLowerCase().includes(term) ||
      (q.ubicacion && q.ubicacion.toLowerCase().includes(term)) ||
      q.opciones.some((op) => op.toLowerCase().includes(term))
    );
  });
}

/**
 * Compara de forma robusta si una opción elegida es la respuesta correcta oficial.
 */
export function esRespuestaCorrecta(
  opcionElegida: string,
  respuestaOficial: string,
  opciones?: string[]
): boolean {
  if (!opcionElegida || !respuestaOficial) return false;

  const choiceClean = opcionElegida.trim().toUpperCase();
  const respClean = respuestaOficial.trim().toUpperCase();

  // 1. Coincidencia exacta (sin importar mayúsculas/minúsculas)
  if (choiceClean === respClean) return true;

  // 2. Ignorar puntos finales y espacios de borde
  const choiceNoDot = choiceClean.replace(/[\.\s]+$/, '');
  const respNoDot = respClean.replace(/[\.\s]+$/, '');
  if (choiceNoDot === respNoDot) return true;

  // 3. Manejo de recortados o prefijos
  if (
    respNoDot.length > 8 &&
    (choiceNoDot.startsWith(respNoDot) || respNoDot.startsWith(choiceNoDot))
  ) {
    return true;
  }

  // 4. Si la respuesta oficial es la letra de la alternativa (ej: "A", "B", "C", "D", "E" o "A.")
  const letterMatch = respClean.match(/^([A-E])[\.\)\s]*$/);
  if (letterMatch && opciones && opciones.length > 0) {
    const letterIndex = letterMatch[1].charCodeAt(0) - 65;
    if (letterIndex >= 0 && letterIndex < opciones.length) {
      return choiceClean === opciones[letterIndex].trim().toUpperCase();
    }
  }

  return false;
}

