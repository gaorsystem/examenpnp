export type GrupoMateria = 'COMUNES' | 'ESPECIALIDAD';

export interface Pregunta {
  id: string;             // Código oficial del banco (ej. "180838")
  numero: number;         // Número de orden (1 - 1500)
  grupo: GrupoMateria;    // 'COMUNES' o 'ESPECIALIDAD'
  norma: string;          // Nombre de la norma o materia
  enunciado: string;      // Texto de la pregunta
  opciones: string[];     // Array con las 5 alternativas
  respuesta: string;      // Alternativa correcta exacta
  ubicacion?: string;     // Artículo/Capítulo/Título del banco oficial
}

export interface NormaInfo {
  id: number;
  nombre: string;
  grupo: GrupoMateria;
  slug: string;
  totalPreguntas: number;
}

export interface RespuestaUsuario {
  preguntaId: string;
  opcionElegida: string;
  esCorrecta: boolean;
  tiempoRespuestaSeg: number;
}

export interface IntentoExamen {
  id: string;
  modo: 'simulacro' | 'repaso' | 'norma' | 'expres' | 'whatsapp';
  normaFiltro?: string;
  totalPreguntas: number;
  aciertos: number;
  duracionSeg: number;
  fecha: string;
  respuestas: RespuestaUsuario[];
}

export interface ProgresoSRS {
  preguntaId: string;
  facilidad: number;       // "ease factor" (ej. 2.5)
  intervaloDias: number;   // días hasta próxima revisión
  proximaRevision: string; // YYYY-MM-DD
  rachaCorrectas: number;
  fallosTotales: number;
  revisionesTotales: number;
  ultimaRevision?: string;
}

export interface UserProfile {
  id: string;
  userId?: string; // Link to auth.users.id
  nombre: string;
  grado: string;
  cip: string;
  dni: string;
  telefonoWhatsapp: string;
  plan: 'free' | 'premium';
  role: 'admin' | 'student';
  metaPreguntasDiarias: number;
  fechaRegistro: string;
}

export interface DominioMateria {
  norma: string;
  grupo: GrupoMateria;
  aciertos: number;
  totalRespondidas: number;
  totalBanco: number;
  porcentaje: number;
}
