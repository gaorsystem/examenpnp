import fs from 'fs';

let content = fs.readFileSync('src/data/questionsData.ts', 'utf8');

// The file got completely corrupted at the top. Let's fix it by downloading from git since we don't have it, but wait, there's no git.
// We'll write the full robust mapping from scratch based on the original template.
const template = `import { Pregunta, NormaInfo, GrupoMateria } from '../types';
import rawQuestions from './rawQuestions.json';
import dl1291Questions from './dl1291Questions.json';
import ley27806Questions from './ley27806Questions.json';
import leyAscensoQuestions from './leyAscensoQuestions.json';
import ley27444Questions from './ley27444Questions.json';
import dl957Questions from './dl957Questions.json';
import usoFuerzaQuestions from './usoFuerzaQuestions.json';
import tidQuestions from './tidQuestions.json';
import dl1106Questions from './dl1106Questions.json';
import ley30364Questions from './ley30364Questions.json';
import ley30077Questions from './ley30077Questions.json';
import protocolosQuestions from './protocolosQuestions.json';
import fortalecerQuestions from './fortalecerQuestions.json';
import extorsionQuestions from './extorsionQuestions.json';
import derechosHumanosQuestions from './derechosHumanosQuestions.json';
import dl1428Questions from './dl1428Questions.json';
import ley30714Questions from './ley30714Questions.json';
import dl1149Questions from './dl1149Questions.json';
import dl1318Questions from './dl1318Questions.json';
import codigoPenalQuestions from './codigoPenalQuestions.json';

// Temas oficiales activos con balotario oficial completo
export const TEMAS_OFICIALES_ACTIVOS = [
  'CONSTITUCIÓN POLÍTICA DEL PERÚ',
  'D.L. 1267 - LEY DE LA POLICÍA NACIONAL DEL PERÚ',
  'DECRETO LEGISLATIVO N° 1291 - LUCHA CONTRA LA CORRUPCIÓN',
  'LEY N° 27806 - LEY DE TRANSPARENCIA Y DE ACCESO A LA INFORMACIÓN',
  'LEY DE PROCESOS DE ASCENSO DE LA POLICÍA NACIONAL DEL PERÚ',
  'LEY N° 27444 - LEY DEL PROCEDIMIENTO ADMINISTRATIVO GENERAL',
  'D.L. 957 - CÓDIGO PROCESAL PENAL',
  'DECRETO LEGISLATIVO Nº 635 - CÓDIGO PENAL',
  'D.L. 1186 - USO DE LA FUERZA PNP',
  'D.L. 1241 - LUCHA CONTRA EL TRÁFICO ILÍCITO DE DROGAS',
  'D.L. 1106 - LUCHA EFICAZ CONTRA EL LAVADO DE ACTIVOS Y LA MINERÍA ILEGAL',
  'LEY 30364 - PREVENIR, SANCIONAR Y ERRADICAR LA VIOLENCIA CONTRA LAS MUJERES Y LOS INTEGRANTES DEL GRUPO FAMILIAR',
  'LEY 30077 - LEY CONTRA EL CRIMEN ORGANIZADO',
  'PROTOCOLOS DE ACTUACIÓN INTERINSTITUCIONAL',
  'LEY 32130 - LEY PARA FORTALECER LA INVESTIGACIÓN DEL DELITO',
  'D. LEG. 1611 - PREVENCIÓN E INVESTIGACIÓN DEL DELITO DE EXTORSIÓN',
  'DERECHOS HUMANOS APLICADOS A LA FUNCIÓN POLICIAL',
  'DL N° 1428 - ATENCIÓN DE CASOS DE DESAPARICIÓN DE PERSONAS',
  'LEY 30714 - RÉGIMEN DISCIPLINARIO DE LA PNP',
  'D.L. 1149 - LEY DE LA CARRERA Y SITUACIÓN DEL PERSONAL PNP',
  'D.L. 1318 - RÉGIMEN DE FORMACIÓN DE LA PNP',
];

const rawFiltered: Pregunta[] = (rawQuestions as any[])
  .filter((q) =>
    q.norma === 'CONSTITUCIÓN POLÍTICA DEL PERÚ' ||
    q.norma === 'D.L. 1267 - LEY DE LA POLICÍA NACIONAL DEL PERÚ'
  )
  .map((q) => ({
    id: q.codigo || String(q.numero),
    numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
    grupo: q.materia_grupo as GrupoMateria,
    norma: q.norma,
    enunciado: q.enunciado,
    opciones: q.opciones,
    respuesta: q.respuesta,
    ubicacion: q.ubicacion,
  }));

const dl1291Mapped: Pregunta[] = (dl1291Questions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'COMUNES' as GrupoMateria,
  norma: 'DECRETO LEGISLATIVO N° 1291 - LUCHA CONTRA LA CORRUPCIÓN',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const ley27806Mapped: Pregunta[] = (ley27806Questions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'COMUNES' as GrupoMateria,
  norma: 'LEY N° 27806 - LEY DE TRANSPARENCIA Y DE ACCESO A LA INFORMACIÓN',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const leyAscensoMapped: Pregunta[] = (leyAscensoQuestions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'LEY DE PROCESOS DE ASCENSO DE LA POLICÍA NACIONAL DEL PERÚ',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const ley27444Mapped: Pregunta[] = (ley27444Questions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'LEY N° 27444 - LEY DEL PROCEDIMIENTO ADMINISTRATIVO GENERAL',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const dl957Mapped: Pregunta[] = (dl957Questions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'D.L. 957 - CÓDIGO PROCESAL PENAL',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const usoFuerzaMapped: Pregunta[] = (usoFuerzaQuestions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'D.L. 1186 - USO DE LA FUERZA PNP',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const tidMapped: Pregunta[] = (tidQuestions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'D.L. 1241 - LUCHA CONTRA EL TRÁFICO ILÍCITO DE DROGAS',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const dl1106Mapped: Pregunta[] = (dl1106Questions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'D.L. 1106 - LUCHA EFICAZ CONTRA EL LAVADO DE ACTIVOS Y LA MINERÍA ILEGAL',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const ley30364Mapped: Pregunta[] = (ley30364Questions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'LEY 30364 - PREVENIR, SANCIONAR Y ERRADICAR LA VIOLENCIA CONTRA LAS MUJERES Y LOS INTEGRANTES DEL GRUPO FAMILIAR',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const ley30077Mapped: Pregunta[] = (ley30077Questions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'LEY 30077 - LEY CONTRA EL CRIMEN ORGANIZADO',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const protocolosMapped: Pregunta[] = (protocolosQuestions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'PROTOCOLOS DE ACTUACIÓN INTERINSTITUCIONAL',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const fortalecerMapped: Pregunta[] = (fortalecerQuestions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'LEY 32130 - LEY PARA FORTALECER LA INVESTIGACIÓN DEL DELITO',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const extorsionMapped: Pregunta[] = (extorsionQuestions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'D. LEG. 1611 - PREVENCIÓN E INVESTIGACIÓN DEL DELITO DE EXTORSIÓN',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const derechosHumanosMapped: Pregunta[] = (derechosHumanosQuestions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'DERECHOS HUMANOS APLICADOS A LA FUNCIÓN POLICIAL',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const dl1428Mapped: Pregunta[] = (dl1428Questions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'DL N° 1428 - ATENCIÓN DE CASOS DE DESAPARICIÓN DE PERSONAS',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const ley30714Mapped: Pregunta[] = (ley30714Questions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'LEY 30714 - RÉGIMEN DISCIPLINARIO DE LA PNP',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const dl1149Mapped: Pregunta[] = (dl1149Questions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'D.L. 1149 - LEY DE LA CARRERA Y SITUACIÓN DEL PERSONAL PNP',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const dl1318Mapped: Pregunta[] = (dl1318Questions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'D.L. 1318 - RÉGIMEN DE FORMACIÓN DE LA PNP',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

const codigoPenalMapped: Pregunta[] = (codigoPenalQuestions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'DECRETO LEGISLATIVO Nº 635 - CÓDIGO PENAL',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));

// Mapeo unificado de los temas oficiales con 100% de preguntas cargadas
export const BANCO_PREGUNTAS: Pregunta[] = [
  ...rawFiltered,
  ...dl1291Mapped,
  ...ley27806Mapped,
  ...leyAscensoMapped,
  ...ley27444Mapped,
  ...dl957Mapped,
  ...usoFuerzaMapped,
  ...tidMapped,
  ...dl1106Mapped,
  ...ley30364Mapped,
  ...ley30077Mapped,
  ...protocolosMapped,
  ...fortalecerMapped,
  ...extorsionMapped,
  ...derechosHumanosMapped,
  ...dl1428Mapped,
  ...ley30714Mapped,
  ...dl1149Mapped,
  ...dl1318Mapped,
  ...codigoPenalMapped
];

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
      .replace(/[\\u0300-\\u036f]/g, '')
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

// Obtener preguntas de la Constitución Política del Perú ordenadas correlativamente
export function getPreguntasConstitucion(): Pregunta[] {
  return BANCO_PREGUNTAS
    .filter((q) => q.norma === 'CONSTITUCIÓN POLÍTICA DEL PERÚ')
    .sort((a, b) => a.numero - b.numero);
}

// Obtener rango específico de preguntas de la Constitución (ej. 1 a 25, 26 a 50, etc.)
export function getPreguntasConstitucionRango(inicio: number, fin: number): Pregunta[] {
  return getPreguntasConstitucion().filter((q) => q.numero >= inicio && q.numero <= fin);
}

// Generar simulacro por tema con opción de orden correlativo o aleatorio
export function generarSimulacroTema(
  normaNombre: string,
  cantidad?: number,
  aleatorio: boolean = true
): Pregunta[] {
  const preguntasTema = getPreguntasPorNorma(normaNombre);
  if (preguntasTema.length === 0) return [];
  
  const base = aleatorio ? barajar(preguntasTema) : [...preguntasTema].sort((a, b) => a.numero - b.numero);
  if (cantidad && cantidad > 0 && cantidad < base.length) {
    return base.slice(0, cantidad);
  }
  return base;
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
  const choiceNoDot = choiceClean.replace(/[\\.\\s]+$/, '');
  const respNoDot = respClean.replace(/[\\.\\s]+$/, '');
  if (choiceNoDot === respNoDot) return true;
  
  // 3. Manejo de recortados o prefijos
  if (
    respNoDot.length > 8 && 
    (choiceNoDot.startsWith(respNoDot) || respNoDot.startsWith(choiceNoDot))
  ) {
    return true;
  }
  
  // 4. Si la respuesta oficial es la letra de la alternativa (ej: "A", "B", "C", "D", "E" o "A.")
  const letterMatch = respClean.match(/^([A-E])[\\.\\)\\s]*$/);
  if (letterMatch && opciones && opciones.length > 0) {
    const letterIndex = letterMatch[1].charCodeAt(0) - 65;
    if (letterIndex >= 0 && letterIndex < opciones.length) {
      return choiceClean === opciones[letterIndex].trim().toUpperCase();
    }
  }

  return false;
}
`;

fs.writeFileSync('src/data/questionsData.ts', template);
