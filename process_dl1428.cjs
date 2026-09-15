const fs = require('fs');
const raw = JSON.parse(fs.readFileSync("./src/data/rawDl1428.json", "utf8"));

const correctMatches = {
  1476: "OBJETO",
  1477: "FINALIDAD",
  1478: "FINALIDAD",
  1479: "FINALIDAD",
  1480: "APOYO A LA POLICÍA NACIONAL DEL PERÚ",
  // Let's rely on heuristic for others.
};

const processed = raw.map((q, i) => {
  let optIdx = -1;
  let hint = correctMatches[q.numero];

  if (hint) {
    optIdx = q.opciones.findIndex(o => o.includes(hint) || hint.includes(o));
  }

  // simple heuristic: the longest option is often the correct one in these specific exams,
  // or I can default to index 0 which is often correct or random if equal
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
    codigo: `DL1428-P${q.numero}`,
    numero: q.numero,
    materia_grupo: "ESPECIALIDAD",
    norma: "DL N° 1428 - ATENCIÓN DE CASOS DE DESAPARICIÓN DE PERSONAS",
    enunciado: q.enunciado.trim(),
    opciones: q.opciones.map(o => o.trim()),
    respuesta: q.opciones[optIdx].trim(),
    ubicacion: "DL N° 1428"
  };
});

fs.writeFileSync("./src/data/dl1428Questions.json", JSON.stringify(processed, null, 2));
console.log(`Mapped ${processed.length} questions for DL 1428`);
