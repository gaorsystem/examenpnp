import { IntentoExamen, ProgresoSRS, UserProfile, DominioMateria, Pregunta } from '../types';
import { BANCO_PREGUNTAS, getNormasInfo } from '../data/questionsData';

const STORAGE_KEYS = {
  INTENTOS: 'simulador_pnp_intentos',
  SRS: 'simulador_pnp_srs',
  FAVORITOS: 'simulador_pnp_favoritos',
  PERFIL: 'simulador_pnp_perfil',
};

// In-memory fallback if localStorage is cleared or restricted
const MEMORY_CACHE: Record<string, any> = {};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
  } catch (e) {
    if (MEMORY_CACHE[key]) return MEMORY_CACHE[key];
  }
  return defaultValue;
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // fallback
  }
  MEMORY_CACHE[key] = value;
}

// ----------------- USER PROFILE -----------------
export const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_pnp_001',
  nombre: 'Oficial PNP',
  grado: 'S1 PNP',
  cip: '31428590',
  telefonoWhatsapp: '+51 987 654 321',
  plan: 'free',
  metaPreguntasDiarias: 20,
  fechaRegistro: new Date().toISOString(),
};

export function getProfile(): UserProfile {
  return getItem<UserProfile>(STORAGE_KEYS.PERFIL, DEFAULT_PROFILE);
}

export function saveProfile(profile: UserProfile): void {
  setItem(STORAGE_KEYS.PERFIL, profile);
}

// ----------------- HISTORIAL INTENTOS -----------------
export function getHistorialIntentos(): IntentoExamen[] {
  return getItem<IntentoExamen[]>(STORAGE_KEYS.INTENTOS, []);
}

export function guardarIntento(intento: IntentoExamen): void {
  const historial = getHistorialIntentos();
  historial.unshift(intento);
  setItem(STORAGE_KEYS.INTENTOS, historial);

  // Actualizar SRS de cada pregunta del intento
  intento.respuestas.forEach((resp) => {
    actualizarProgresoSRS(resp.preguntaId, resp.esCorrecta);
  });
}

// ----------------- SRS (Spaced Repetition System / Algoritmo SM-2) -----------------
export function getProgresoSRSMap(): Record<string, ProgresoSRS> {
  return getItem<Record<string, ProgresoSRS>>(STORAGE_KEYS.SRS, {});
}

export function actualizarProgresoSRS(preguntaId: string, esCorrecta: boolean, calidadSubjetiva?: number): ProgresoSRS {
  const srsMap = getProgresoSRSMap();
  const hoyStr = new Date().toISOString().split('T')[0];

  const actual: ProgresoSRS = srsMap[preguntaId] || {
    preguntaId,
    facilidad: 2.5,
    intervaloDias: 1,
    proximaRevision: hoyStr,
    rachaCorrectas: 0,
    fallosTotales: 0,
    revisionesTotales: 0,
  };

  actual.revisionesTotales += 1;
  actual.ultimaRevision = hoyStr;

  // Determinar calidad SM-2 (0 a 5)
  let q = calidadSubjetiva;
  if (q === undefined) {
    q = esCorrecta ? 4 : 1; // 4: fácil/correcto, 1: fallo
  }

  if (esCorrecta) {
    actual.rachaCorrectas += 1;
    if (actual.rachaCorrectas === 1) {
      actual.intervaloDias = 1;
    } else if (actual.rachaCorrectas === 2) {
      actual.intervaloDias = 3;
    } else {
      actual.intervaloDias = Math.round(actual.intervaloDias * actual.facilidad);
    }
    // Modificar ease factor
    actual.facilidad = Math.max(1.3, actual.facilidad + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  } else {
    actual.fallosTotales += 1;
    actual.rachaCorrectas = 0;
    actual.intervaloDias = 1; // repetir mañana
    actual.facilidad = Math.max(1.3, actual.facilidad - 0.2);
  }

  // Calcular próxima fecha de revisión
  const proxima = new Date();
  proxima.setDate(proxima.getDate() + actual.intervaloDias);
  actual.proximaRevision = proxima.toISOString().split('T')[0];

  srsMap[preguntaId] = actual;
  setItem(STORAGE_KEYS.SRS, srsMap);

  return actual;
}

// Obtener preguntas pendientes de revisión SRS hoy
export function getPreguntasPendientesSRS(): Pregunta[] {
  const srsMap = getProgresoSRSMap();
  const hoyStr = new Date().toISOString().split('T')[0];

  const idsFalladasOSRS = Object.values(srsMap)
    .filter((srs) => srs.proximaRevision <= hoyStr || srs.rachaCorrectas === 0)
    .map((srs) => srs.preguntaId);

  // Filtrar banco
  const pendientes = BANCO_PREGUNTAS.filter((p) => idsFalladasOSRS.includes(p.id));

  // Si no hay suficientes pendientes por agenda, agregar preguntas con bajo acierto o aleatorias no respondidas
  if (pendientes.length < 10) {
    const respondidasIds = new Set(Object.keys(srsMap));
    const noRespondidas = BANCO_PREGUNTAS.filter((p) => !respondidasIds.has(p.id));
    return [...pendientes, ...noRespondidas.slice(0, 15 - pendientes.length)];
  }

  return pendientes;
}

// ----------------- FAVORITOS / MARCADOS -----------------
export function getFavoritos(): string[] {
  return getItem<string[]>(STORAGE_KEYS.FAVORITOS, []);
}

export function toggleFavorito(preguntaId: string): boolean {
  const favs = getFavoritos();
  const index = favs.indexOf(preguntaId);
  let isFav = false;
  if (index >= 0) {
    favs.splice(index, 1);
  } else {
    favs.push(preguntaId);
    isFav = true;
  }
  setItem(STORAGE_KEYS.FAVORITOS, favs);
  return isFav;
}

// ----------------- DOMINIO Y ANALÍTICA -----------------
export function calcularDominioPorMateria(): DominioMateria[] {
  const intentos = getHistorialIntentos();
  const normas = getNormasInfo();

  const acumulado: Record<string, { ok: number; total: number }> = {};

  intentos.forEach((intento) => {
    intento.respuestas.forEach((resp) => {
      const q = BANCO_PREGUNTAS.find((p) => p.id === resp.preguntaId);
      if (q) {
        if (!acumulado[q.norma]) {
          acumulado[q.norma] = { ok: 0, total: 0 };
        }
        acumulado[q.norma].total += 1;
        if (resp.esCorrecta) acumulado[q.norma].ok += 1;
      }
    });
  });

  return normas.map((n) => {
    const stats = acumulado[n.nombre] || { ok: 0, total: 0 };
    const pct = stats.total > 0 ? Math.round((stats.ok / stats.total) * 100) : 0;
    return {
      norma: n.nombre,
      grupo: n.grupo,
      aciertos: stats.ok,
      totalRespondidas: stats.total,
      totalBanco: n.totalPreguntas,
      porcentaje: pct,
    };
  });
}

// Cálculo del Indicador Global de Preparación (0 - 100%)
export function calcularIndicadorPreparacionGlobal(): {
  porcentajeGlobal: number;
  totalRespondidas: number;
  totalCorrectas: number;
  rachaActual: number;
  evaluacionTexto: string;
  nivelLegible: string;
} {
  const intentos = getHistorialIntentos();
  let totalResp = 0;
  let totalOk = 0;

  intentos.forEach((intento) => {
    totalResp += intento.totalPreguntas;
    totalOk += intento.aciertos;
  });

  const pct = totalResp > 0 ? Math.round((totalOk / totalResp) * 100) : 0;

  // Racha
  let racha = 0;
  for (const intento of intentos) {
    if ((intento.aciertos / intento.totalPreguntas) >= 0.65) {
      racha++;
    } else {
      break;
    }
  }

  let nivelLegible = 'Iniciando Repaso';
  let evaluacionTexto = 'Comienza realizando tus primeros simulacros para medir tu nivel inicial.';

  if (totalResp >= 20) {
    if (pct >= 85) {
      nivelLegible = 'Sobresaliente (Apto Ascenso)';
      evaluacionTexto = 'Dominio de excelencia. Mantén el ritmo de repaso SRS para asegurar tu vacante.';
    } else if (pct >= 70) {
      nivelLegible = 'Apto Competitivo';
      evaluacionTexto = 'Buen nivel de preparación. Enfócate en las materias con menor porcentaje de aciertos.';
    } else if (pct >= 55) {
      nivelLegible = 'En Desarrollo';
      evaluacionTexto = 'En camino al puntaje requerido. Refuerza las normas de especialidad y leyes disciplinarias.';
    } else {
      nivelLegible = 'Requiere Refuerzo';
      evaluacionTexto = 'Puntaje por debajo del mínimo recomendado. Realiza sesiones diarias de repaso dirigido.';
    }
  }

  return {
    porcentajeGlobal: pct,
    totalRespondidas: totalResp,
    totalCorrectas: totalOk,
    rachaActual: racha,
    evaluacionTexto,
    nivelLegible,
  };
}
