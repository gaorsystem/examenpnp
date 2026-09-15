import { Pregunta } from '../types';

export interface ActiveExamSession {
  id: string;
  modo: 'simulacro' | 'repaso' | 'norma' | 'expres' | 'whatsapp';
  normaFiltro?: string;
  preguntas: Pregunta[];
  tiempoLimiteMinutos: number;
  segundosRestantes: number;
  currentIndex: number;
  respuestasMap: Record<string, { opcion: string; tiempoSeg: number; esCorrecta?: boolean }>;
  eliminatedMap: Record<string, string[]>;
  status: 'in_progress' | 'paused';
  savedAt: number;
  tituloExamen: string;
}

const ACTIVE_EXAM_KEY = 'simulador_pnp_active_exam_v1';

export function getActiveExamSession(): ActiveExamSession | null {
  try {
    const raw = localStorage.getItem(ACTIVE_EXAM_KEY);
    if (!raw) return null;
    const parsed: ActiveExamSession = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.preguntas) && parsed.preguntas.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Error reading active exam session:', e);
  }
  return null;
}

export function saveActiveExamSession(session: ActiveExamSession): void {
  try {
    localStorage.setItem(
      ACTIVE_EXAM_KEY,
      JSON.stringify({
        ...session,
        savedAt: Date.now(),
      })
    );
  } catch (e) {
    console.error('Error saving active exam session:', e);
  }
}

export function updateActiveExamProgress(partial: Partial<ActiveExamSession>): void {
  const current = getActiveExamSession();
  if (current) {
    saveActiveExamSession({
      ...current,
      ...partial,
      savedAt: Date.now(),
    });
  }
}

export function clearActiveExamSession(): void {
  try {
    localStorage.removeItem(ACTIVE_EXAM_KEY);
  } catch (e) {
    console.error('Error clearing active exam session:', e);
  }
}

export function hasActiveExamSession(): boolean {
  return getActiveExamSession() !== null;
}
