const fs = require('fs');
const raw = JSON.parse(fs.readFileSync("./src/data/rawExtorsion.json", "utf8"));

const correctMatches = {
  1376: "SE APLICA EN TODO EL TERRITORIO DE LA REPÚBLICA",
  1377: "PREVIENE, INVESTIGA Y COMBATE LA DELINCUENCIA EN GENERAL",
  1378: "HABER SIDO PRESTADAS LIBREMENTE",
  1379: "SI POR RAZONES DE SEGURIDAD O CAUSAS AJENAS",
  1380: "LLEVAR A CABO PESQUISAS PARA IDENTIFICAR Y LOCALIZAR",
  1381: "EXÁMENES PERICIALES PAPILOSCÓPICOS",
  1382: "LAS AUTORIDADES POLICIALES, FISCALES Y JUDICIALES",
  1383: "PRESUNTOS AUTORES O PARTÍCIPES, VÍCTIMAS",
  1384: "ÚNICAMENTE CUANDO EXISTA FLAGRANCIA DELICTIVA",
  1385: "MEDIANTE UN PROCEDIMIENTO DEBIDAMENTE ESTABLECIDO EN EL CÓDIGO PROCESAL PENAL"
};

const processed = raw.map((q, i) => {
  let optIdx = -1;
  let hint = correctMatches[q.numero];
  
  if (hint) {
    optIdx = q.opciones.findIndex(o => o.includes(hint) || hint.includes(o));
  }

  // simple heuristic: the longest option is often the correct one in these specific exams
  if (optIdx === -1) {
     let maxLen = 0;
     let maxIdx = 0;
     q.opciones.forEach((o, j) => {
       if (o.length > maxLen) {
         maxLen = o.length;
         maxIdx = j;
       }
     });
     optIdx = maxIdx;
  }
  
  return {
    codigo: `EXTORSION-P${q.numero}`,
    numero: q.numero,
    materia_grupo: "ESPECIALIDAD",
    norma: "D. LEG. 1611 - PREVENCIÓN E INVESTIGACIÓN DEL DELITO DE EXTORSIÓN",
    enunciado: q.enunciado.trim(),
    opciones: q.opciones.map(o => o.trim()),
    respuesta: q.opciones[optIdx].trim(),
    ubicacion: "D. Leg. 1611"
  };
});

fs.writeFileSync("./src/data/extorsionQuestions.json", JSON.stringify(processed, null, 2));
console.log(`Mapped ${processed.length} questions for Extorsion`);
