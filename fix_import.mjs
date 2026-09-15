import fs from 'fs';
let content = fs.readFileSync('src/data/questionsData.ts', 'utf8');

// Find the bottom logic
const bottomMarker = "const codigoPenalQuestions = require('./codigoPenalQuestions.json');";
const injectLogic = content.substring(content.indexOf(bottomMarker));

// Remove it from the bottom
content = content.substring(0, content.indexOf(bottomMarker));

// Add import at the top
content = content.replace("import dl1318Questions from './dl1318Questions.json';", "import dl1318Questions from './dl1318Questions.json';\nimport codigoPenalQuestions from './codigoPenalQuestions.json';");

// Re-add the push logic before exports
const insertBefore = "export function getNormasInfo";
content = content.replace(insertBefore, 
`const codigoPenalMapped: Pregunta[] = (codigoPenalQuestions as any[]).map((q) => ({
  id: q.codigo || String(q.numero),
  numero: typeof q.numero === 'number' ? q.numero : parseInt(q.numero, 10),
  grupo: 'ESPECIALIDAD' as GrupoMateria,
  norma: 'DECRETO LEGISLATIVO Nº 635 - CÓDIGO PENAL',
  enunciado: q.enunciado,
  opciones: q.opciones,
  respuesta: q.respuesta,
  ubicacion: q.ubicacion,
}));
BANCO_PREGUNTAS.push(...codigoPenalMapped);

${insertBefore}`);

fs.writeFileSync('src/data/questionsData.ts', content);
